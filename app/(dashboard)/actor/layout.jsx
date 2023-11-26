import '@styles/globals.css';
export const metadata = {
  title: 'All Actors',
  description: 'All Hotest Porn stars in the world',
}

const AllActorLayout = ({children}) => {
  return (
    <section className='w-full flex-center'>
      {children}
    </section>
  )
}

export default AllActorLayout