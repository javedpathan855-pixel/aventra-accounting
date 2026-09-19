import { Metadata } from "next";
import {
  Lato,
  Momo_Signature,
  Montserrat,
  Playwrite_AU_SA,
} from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Aventra | Accounting",
  description:
    "Aventra is a professional accounting firm that provides a range of accounting services to businesses and individuals.",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body
        className={`${lato.variable} ${montserrat.variable} ${signature.variable}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
