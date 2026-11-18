# Birthday Meme Invitation

Русскоязычное приглашение на день рождения: Next.js App Router, React, Tailwind CSS 4, Motion и Lucide. Неоновый коллаж, адаптивная вёрстка, мобильное меню и доступная с клавиатуры RSVP-форма.

## Локальный запуск

Нужны Node.js 22+ и npm. Установка зависимостей и запуск выполняются отдельно:

```bash
npm install
npm run dev
```

Откройте http://127.0.0.1:3000.

## Запуск в Docker

```bash
docker compose up -d --build
```

Сайт откроется на http://127.0.0.1:3001. Compose публикует порт только на loopback хоста. Порт можно задать через `HOST_PORT`. Сборка и сервер работают от пользователя `node` с UID/GID `1000:1000` внутри контейнера.

Если на Linux уже настроен пользовательский Docker Engine с контекстом `rootless`, запустите проект через него:

```bash
docker --context rootless compose up -d --build
```

При использовании публичного адреса передайте `SITE_URL` при сборке образа, чтобы в превью ссылки использовался этот адрес:

```bash
SITE_URL=https://tortimemy.landingprod.ru docker --context rootless compose up -d --build
```

## Настройки приглашения

Дата, время, место, подпись, программа и лимит гостей находятся в `config/event.json`. Дата показана ровно как в исходном задании, без предположений о годе.

При публикации задайте переменную окружения `SITE_URL` с адресом сайта для Open Graph. По умолчанию используется локальный адрес.

RSVP сохраняется в localStorage на устройстве гостя. Форма явно сообщает, что ответ не отправляется организатору. Повторное открытие позволяет изменить ответ. Сервер и внешние сервисы не подключены.

Иллюстрация находится в `public/images/party-scene.webp`, локальные шрифты — в `public/fonts`. Страница не загружает шрифты со сторонних серверов. Системная настройка уменьшения анимации отключает конфетти и анимации.

## Проверки

```bash
npm test
npm run typecheck
npm run build
```

Тесты RSVP работают на стандартном `node:test`, не требуют установки зависимостей и доступа к интернету.

## Иллюстрация

`public/images/party-scene.webp` создана встроенным ImageGen и оптимизирована в WebP. Промпт:

<details>
<summary>Промпт праздничного коллажа</summary>

Use case: stylized-concept. Asset type: full-bleed background artwork for a Russian birthday invitation website, landscape aspect ratio 3:2, 1536x1024.

Create a maximalist, very high quality humorous party photomontage with photorealistic meme animals in a deep purple nightclub party. The main important requirement is the LARGE CLEAN EMPTY SPACE in the central area from x=25% to x=76%, y=13% to y=77%: this center is ONLY smooth dark aubergine and violet atmospheric background, no objects, no writing, no faces, because HTML headlines and controls will be layered there. All subjects at edges.

At bottom-left, x=3–25%, y=45–96%, a large grey-white fluffy realistic cat wearing chunky black pixelated thug-life sunglasses, shiny gold birthday party cone hat, thick gold chain, holding a red plastic party cup in paw. Cat is a die-cut meme sticker with a crisp thick off-white outline, slightly tilted inward.

At right, x=78–98%, y=57–95%, an excited white fluffy cat with wide open mouth wearing pink heart shaped sunglasses, sticker cutout with white outline.

At upper-right, x=82–96%, y=23–45%, a small Shiba Inu Doge with rainbow birthday hat, die-cut white outline.

A gold chrome round smiley face helium balloon at x=8%, y=25%, glossy pink and violet balloons hugging both edges at top-left and far-right. Curving fairy light cable with warm tiny bulbs along the very top. Subtle scattered confetti and a few paper streamers confined to the edges. A foreground table along only the bottom 10% with party cups and some popcorn and at absolute bottom-center a pink frosted birthday cake with sprinkles and five glowing candles. The cake is x=38–62%, y=82–100%, with its base slightly cropped at bottom.

Deep color palette #22052F, #290A39, violet and hot magenta atmospheric lighting, warm gold highlights. Sophisticated photographic collage with playful editorial sticker aesthetic, realistic fur, believable specular balloon reflections, slight film grain. Dark corners, magenta bloom behind side characters. Central background must remain dark, clean and uncluttered for readable UI. NO text, NO letters, NO logos, NO speech bubbles, NO UI, NO watermark.

</details>
