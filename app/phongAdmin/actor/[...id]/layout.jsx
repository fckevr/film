export async function generateMetadata({params}) {
    const response = await fetch('/api/actor/' + params.id[1])
    const actor = await response.json()
    return {
        title: "Update " + actor.name,
    }
}
const UpdateActorLayout = ({children}) => {
    return (
        <div>{children}</div>
    )
}

export default UpdateActorLayout
