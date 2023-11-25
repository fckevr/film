export async function generateMetadata({params}) {
    const response = await fetch('/api/category/' + params.id[1])
    const category = await response.json()
    return {
        title: "Update " + category.name,
    }
}
const UpdateCategoryLayout = ({children}) => {
    return (
        <div>{children}</div>
    )
}

export default UpdateCategoryLayout
