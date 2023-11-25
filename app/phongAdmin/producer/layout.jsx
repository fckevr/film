import '@styles/globals.css';
export const metadata = {
    title: 'All Producers',
  }


  const ProducerManagerLayout = ({children}) => {
    return (
      <section>
        {children}
      </section>
    )
  }
  
  export default ProducerManagerLayout