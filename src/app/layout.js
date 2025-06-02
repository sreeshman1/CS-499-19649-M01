import './globals.css'; // Import Tailwind CSS base styles
import Navbar from './components/Navbar';

export const metadata = {
  title: 'Travlr Getaways Next.js',
  description: 'Your next adventure starts here!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className="bg-gray-100 font-sans">
        <Navbar /> 
        <main className="container mx-auto p-4">
          {children}
        </main>
        {/* <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" async /> */}
      </body>
    </html>
  );
}