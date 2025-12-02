import "./globals.css";
import { Prompt } from "next/font/google";

const prompt = Prompt({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-prompt",
});

export const metadata = {
  title: "Part-Time Match - หางาน Part-time ที่ใช่สำหรับคุณ",
  description: "ระบบจับคู่อัตโนมัติที่ช่วยหางาน Part-time ตามเวลาว่างและระยะทางของคุณ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={prompt.variable} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}