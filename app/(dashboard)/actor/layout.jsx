import '@styles/globals.css';
export async function generateMetadata() {
    const response = await fetch("/api/actor/all")
    const actors = await response.json()
    const listName = actors.map(actor => actor.name)
    return {
        title: 'All Actors',
        description: listName.join(', '),
    }
}


  const AllActorLayout = ({children}) => {
    return (
      <section>
        {children}
      </section>
    )
  }
  
  export default AllActorLayout