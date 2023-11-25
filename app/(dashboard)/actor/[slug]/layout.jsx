export async function generateMetadata({params}) {
    const response = await fetch("/api/film/search?actor=" + params.slug)
    const actor = await response.json()
    return {
        title: actor.name,
        description: actor.info,
    }
}
const ActorLayout = ({children}) => {
    return (
        <div>{children}</div>
    )
}

export default ActorLayout