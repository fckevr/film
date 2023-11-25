import '@styles/globals.css';
export const metadata = {
    title: 'Chat',
    description: 'Chat page'
}


const MessageLayout = ({children}) => {
return (
    <section className='w-full flex-center'>
        {children}
    </section>
)
}
  
export default MessageLayout



