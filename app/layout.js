import "./globals.css";
import "./demo.css";

export const metadata = {
  title: "Kisaan.ai — Your field, understood",
  description: "A voice-first farming companion for the growers of Sindh.",
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
