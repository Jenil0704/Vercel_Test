// pages/_app.tsx
// import "./global.css";
import type { AppProps } from "next/app";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <Component {...pageProps} />
    </main>
  );
}
