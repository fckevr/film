export async function generateMetadata({params}) {
    const response = await fetch('/api/producer/' + params.id[1])
    const producer = await response.json()
    return {
        title: "Update " + producer.name,
    }
}
const UpdateProducerLayout = ({children}) => {
    return (
        <div>{children}</div>
    )
}

export default UpdateProducerLayout
