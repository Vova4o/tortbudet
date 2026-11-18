import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import event from "@/config/event.json";
import "./fonts.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://127.0.0.1:3000"),
  title: `${event.title} — ты в списке гостей!`,
  description: event.description,
  applicationName: "Birthday Meme Invitation",
  icons: { icon: "/icon.svg" },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Приглашаю тебя на мой день рождения!",
    description: event.description,
    locale: "ru_RU",
    type: "website",
    images: [{ url: "/images/party-scene.webp", width: 1536, height: 1024, alt: "Коты-мемы на праздничной вечеринке" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#290a39",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
