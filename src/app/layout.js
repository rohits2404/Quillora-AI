import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Quillora AI",
    description:
        "The AI-Powered Platform That Turns Your Ideas Into Engaging Content And Helps You Build a Thriving Creator Business.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className}`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <main className="bg-slate-900 min-h-screen text-white overflow-x-hidden">
                        <Toaster richColors />
                        {children}
                    </main>
                </ThemeProvider>
            </body>
        </html>
    );
}
