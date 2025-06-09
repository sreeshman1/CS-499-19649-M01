import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import Navbar from './components/Navbar';
import '@mantine/core/styles.css';

export const metadata = {
  title: 'Travlr Getaways Next.js',
  description: 'Your next adventure starts here!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <MantineProvider>
          <Navbar />
          <main>{children}</main>
        </MantineProvider>
      </body>
    </html>
  );
}
