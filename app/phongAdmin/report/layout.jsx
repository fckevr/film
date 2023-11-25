import '@styles/globals.css';
export const metadata = {
    title: 'All Reports',
  }


  const ReportManagerLayout = ({children}) => {
    return (
      <section>
        {children}
      </section>
    )
  }
  
  export default ReportManagerLayout