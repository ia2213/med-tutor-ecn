import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MedTutor ECN - Tuteur Médical IA',
  description: 'Tuteur médical intelligent pour la préparation à l\'ECN (Épreuves Classantes Nationales) français. Uploadez vos livres et posez vos questions.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  )
}
