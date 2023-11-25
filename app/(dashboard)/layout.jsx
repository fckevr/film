import '@styles/globals.css';
import Nav from '@components/Nav'
import Footer from '@components/Footer';
export const metadata = {
    title: "Phong",
    description: "Ngo DInh Phong"
}
const MainLayout = ({children}) => {
  
  return (
    <html lang="en">
        <body>
          <div className='dark-100'>
              <header>
                <Nav></Nav>
              </header>
              <main className='app min-h-screen'>
                  {children}
              </main>
              <footer className='mt-10'>
                <Footer></Footer>
              </footer>
          </div>
        </body>
    </html>
  )
}

export default MainLayout