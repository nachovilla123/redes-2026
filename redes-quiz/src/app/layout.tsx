import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Redes Quiz — UTN FRBA",
  description: "Quiz y flashcards para Redes de Información",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <body className={`${geist.className} min-h-full antialiased`}>
        {children}
      </body>
    </html>
  );
}
