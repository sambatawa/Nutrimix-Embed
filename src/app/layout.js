import "./globals.css";

const geistSans = {
  variable: "--font-geist-sans",
  className: "font-sans"
};

const geistMono = {
  variable: "--font-mono", 
  className: "font-mono"
};

export const metadata = {
  title: "Nutrimix",
  description: "Nutrimix ALat pakan Lele, Welcome to our Web Bro and Sis"
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${geistSans.className} ${geistMono.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
