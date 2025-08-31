
import './globals.css';
export const metadata = { title: 'Campus Tasker' };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
