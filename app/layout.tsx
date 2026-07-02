import type { Metadata, Viewport } from "next";
import { Baloo_2, Mali } from "next/font/google";
import {
  ThemeProvider,
  ThemeScript,
} from "@/src/presentation/providers/theme-provider";
import "./styles/index.css";

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const mali = Mali({
  variable: "--font-mali",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

// Base URL ใช้แปลง opengraph-image/twitter-image (file-based) เป็น absolute URL
// (crawler อย่าง Facebook/LINE ต้องการ URL เต็ม) — ตั้ง APP_URL บน production ได้
const siteUrl = process.env.APP_URL ?? "https://easy-abc.easy-ai.online";

const title = "Easy ABC — เกมสะกดคำสำหรับเด็ก";
const description =
  "เรียนรู้ภาษาอังกฤษผ่านการเล่น สนุก ปลดด่าน เก็บดาว! เกมสะกดคำภาษาอังกฤษสำหรับเด็ก เล่นฟรีบนเว็บ ไม่ต้องดาวน์โหลด เล่นได้ทุกอุปกรณ์";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Easy ABC",
  },
  description,
  applicationName: "Easy ABC",
  manifest: "/favicon/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Easy ABC",
  },
  // favicon.ico / icon.png / apple-icon.png ใน app/ ถูกใส่ให้อัตโนมัติ (file-based)
  // เพิ่มขนาดจากชุดที่เตรียมไว้ใน public/favicon/ ให้ครบ
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      {
        url: "/favicon/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: [{ url: "/favicon/apple-touch-icon.png", sizes: "180x180" }],
  },
  // og:image / twitter:image มาจาก app/opengraph-image.png และ
  // app/twitter-image.png อัตโนมัติ (file-based metadata)
  openGraph: {
    type: "website",
    siteName: "Easy ABC",
    locale: "th_TH",
    url: siteUrl,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#5CC6F5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      suppressHydrationWarning
      className={`${baloo.variable} ${mali.variable} h-full antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-dvh flex flex-col bg-sky-scene">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
