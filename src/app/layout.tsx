import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NexusAI Advisory — AI Architecture & Advisory Portal',
  description: 'Automated AI Intelligence Gathering, Architectural Blueprints, and Advisory Launchpad running on a 100% Free Stack.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-cyan-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
