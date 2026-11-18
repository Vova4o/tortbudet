# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS build
WORKDIR /home/node
USER node:node
RUN mkdir -p /home/node/app /home/node/runtime-cache/images
WORKDIR /home/node/app

COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY --chown=node:node . .

ARG SITE_URL=http://127.0.0.1:3001
# A checkout can inherit a restrictive umask, so normalize assets before handing ownership to root.
RUN SITE_URL="$SITE_URL" NEXT_STANDALONE=1 npm run build \
    && chmod -R u=rwX,go=rX public .next/standalone .next/static

FROM base AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3000

COPY --from=build --chown=0:0 /home/node/app/.next/standalone/ ./
COPY --from=build --chown=0:0 /home/node/app/.next/static/ ./.next/static/
COPY --from=build --chown=0:0 /home/node/app/public/ ./public/
COPY --from=build --chown=node:node /home/node/runtime-cache/ ./.next/cache/

USER node:node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:' + process.env.PORT).then(response => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"]
CMD ["node", "server.js"]
