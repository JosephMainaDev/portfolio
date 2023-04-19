import './globals.css'

export const metadata = {
  title: 'Tools created by Joseph Maina',
  description: 'Created with Next.js 13',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
