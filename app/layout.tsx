import "./globals.css";
import { Prompt } from "next/font/google";
import { ThemeProvider } from "./providers/ThemeProvider";
import Footer from "@/components/home/Footer";
// 1. เพิ่มการ Import AlertContainerProvider
import { AlertContainerProvider } from "@/components/ui/AlertContainer";

const prompt = Prompt({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-prompt",
});

export const metadata = {
  title: "MatchWork",
  description: "ระบบจับคู่อัตโนมัติที่ช่วยหางาน Part-time ตามเวลาว่างและระยะทางของคุณ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={prompt.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AlertContainerProvider>
            {children}
            <Footer />
          </AlertContainerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}