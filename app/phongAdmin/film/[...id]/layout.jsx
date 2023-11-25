export async function generateMetadata({params}) {
    const response = await fetch('/api/film/' + params.id[1])
    const film = await response.json()
    return {
        title: "Update " + film.name,
    }
}
const UpdateFilmLayout = ({children}) => {
    return (
        <div>{children}</div>
    )
}

export default UpdateFilmLayout
