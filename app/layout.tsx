export const metadata = {
  title: 'Diffraction Visualiser',
  description: 'Fraunhofer diffraction of a double slit',
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