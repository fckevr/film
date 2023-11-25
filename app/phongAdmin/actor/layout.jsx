import '@styles/globals.css';
export const metadata = {
    title: 'All Stars',
  }


  const ActorManagerLayout = ({children}) => {
    return (
      <section>
        {children}
      </section>
    )
  }
  
  export default ActorManagerLayout