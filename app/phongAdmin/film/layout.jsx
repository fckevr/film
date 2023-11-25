import '@styles/globals.css';
export const metadata = {
    title: 'All Films',
  }


  const FilmManagerLayout = ({children}) => {
    return (
      <section>
        {children}
      </section>
    )
  }
  
  export default FilmManagerLayout