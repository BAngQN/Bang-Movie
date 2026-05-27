import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ReduxProvider } from "@/store/provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthInitializer } from "@/components/auth/AuthInitializer";
import { FavoritesSync } from "@/components/auth/FavoritesSync";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Bang Movie | Discover Movies & TV Shows",
    description: "Explore trending movies, TV shows, and web series.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${geist.className} h-full`}
            suppressHydrationWarning
        >
            <body className="min-h-full flex flex-col bg-[#0f0f1a] text-white">
                <ReduxProvider>
                    <AuthInitializer />
                    <FavoritesSync />
                    <Header />
                    <main className="flex-1 pt-16">{children}</main>
                    <Footer />
                </ReduxProvider>
            </body>
        </html>
    );
}
