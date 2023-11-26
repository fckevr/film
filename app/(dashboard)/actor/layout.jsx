import '@styles/globals.css';
export async function generateMetadata() {
    const response = await fetch(process.env.APP_URL + "/api/actor/all", {
      cache: "no-cache",
    })
    const actors = await response.json()
    const listName = actors.map(actor => actor.name)
    return {
        title: 'All Actors',
        description: listName.join(', '),
    }
}


  const AllActorLayout = ({children}) => {
    return (
      <section className='w-full flex-center'>
        {children}
      </section>
    )
  }
  
  export default AllActorLayout