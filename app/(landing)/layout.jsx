import '@styles/globals.css';

export default function RootLadingLayout({ children }) {
 return (
    <html lang="en">
      <body className='dark-100'>
        <main className="app">
          {children}
        </main>
      </body>
    </html>
  )
}
