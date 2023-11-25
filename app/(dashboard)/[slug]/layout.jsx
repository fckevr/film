export async function generateMetadata({params}) {
    const film = await fetch("/api/film/" + params.slug)
    return {
        title: film.name,
        description: film.description,
    }
}
const FilmLayout = ({children}) => {
    return (
        <div>{children}</div>
    )
}

export default FilmLayout