// src/app/layout.js
import { Jost } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

export const metadata = {
  title: "EcoAction Hub - Environmental Action Platform",
  description: "Connect with your community, report environmental issues, and make a real impact. EcoAction Hub empowers citizens to create positive change.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${jost.variable} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
