import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata = {
  title: "Trackedfitness",
  description: "Diet and fitness tracking web application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
