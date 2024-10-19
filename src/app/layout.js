// app/layout.js

import Link from "next/link";
import "./globals.css";

export const metadata = {
    title: "GFG Notifications",
    description: "GFG Notifications - Send and receive notifications",
};

export default function RootLayout({ children }) {


    return (
        <html lang="en">
            <body className="min-h-screen">

                <h1 className="text-center py-20 text-2xl">Sp0xF8's big dick cloud radar</h1>

                {children}

            </body>
        </html>
    );
}