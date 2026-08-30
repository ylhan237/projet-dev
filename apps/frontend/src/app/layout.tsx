import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AgentHub',
  description: 'Plateforme de support client autonome avec IA agentique',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
