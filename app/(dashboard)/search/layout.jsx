export function generateMetadata({params}) {
    return {
        title: "Search - " + params,
        description: "Search results for " + params,
    }
}

const SearchLayout = ({children}) => {
    return (
        <div>{children}</div>
    )
}

export default SearchLayout