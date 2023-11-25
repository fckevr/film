import '@styles/globals.css';
export async function generateMetadata({params}) {
    const response = await fetch(process.env.APP_URL + "/api/film/" + params.slug)
    const film = await response.json()
    return {
        title: film.code + " - " + film.name,
        description: film.code + " - " + film.description,
    }
}
const FilmLayout = ({children}) => {
    return (
        <div className="w-full flex-center">{children}</div>
    )
}

export default FilmLayout