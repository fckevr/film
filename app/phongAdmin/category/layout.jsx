import '@styles/globals.css';
export const metadata = {
    title: 'All Categories',
  }


  const CategoryManagerLayout = ({children}) => {
    return (
      <section>
        {children}
      </section>
    )
  }
  
  export default CategoryManagerLayout
