import { Metadata } from "next";
import {
  Lato,
  Montserrat,
  Playwrite_AU_SA,
  Shadows_Into_Light,
} from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";
import ThemeProvider from "@/shared/providers/theme-provider";

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["300", "400", "700", "900"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "700", "900"],
});

const signature = Playwrite_AU_SA({
  weight: "400",
  variable: "--font-signature",
});

const shadow = Shadows_Into_Light({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-shadow",
});

export const metadata: Metadata = {
  title: "Aventra | Accounting",
  description:
    "Aventra is a professional accounting firm that provides a range of accounting services to businesses and individuals.",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${lato.variable} ${montserrat.variable} ${signature.variable} ${shadow.variable}`}
        suppressHydrationWarning
      >
        <ThemeProvider> {children}</ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
