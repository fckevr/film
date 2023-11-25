import '@styles/globals.css';
import Provider from '@components/Provider';
import SocketProvider from '@components/SocketProvider';

const RootLayout = ({children}) => {
  return (
    <html lang="en">
      <body>
        <Provider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </Provider>
      </body>
    </html>
  )
}

export default RootLayout