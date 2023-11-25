export function generateMetadata({params}) {
    return {
        title: "Profile" + params.username,
    }
}
const ProfileLayout = ({children}) => {
    return (
        <div>{children}</div>
    )
}

export default ProfileLayout