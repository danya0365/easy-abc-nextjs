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

export const metadata: Metadata = {
  metadataBase: new URL("https://easy-abc.easy-ai.online"),
  title: {
    default: "Easy ABC — เกมสะกดคำสำหรับเด็ก",
    template: "%s | Easy ABC",
  },
  description:
    "เรียนรู้ภาษาอังกฤษผ่านการเล่น สนุก ปลดด่าน เก็บดาว! เกมสะกดคำภาษาอังกฤษสำหรับเด็ก เล่นฟรีบนเว็บ ไม่ต้องดาวน์โหลด เล่นได้ทุกอุปกรณ์",
  openGraph: {
    title: "Easy ABC — เกมสะกดคำสำหรับเด็ก",
    description: "เรียนรู้ผ่านการเล่น — สนุก ปลดด่าน เก็บดาว!",
    images: ["/easy-abc/open-graph.png"],
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
