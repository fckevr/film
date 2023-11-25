import '@styles/globals.css';
import Provider from '@components/Provider';
import ChatPageLayout from './(dashboard)/chat/layout';

const RootLayout = ({children}) => {
  return (
    <html lang="en">
      <body>
        <Provider>
          <ChatPageLayout>
            {children}
          </ChatPageLayout>
        </Provider>
      </body>
    </html>
  )
}

export default RootLayout