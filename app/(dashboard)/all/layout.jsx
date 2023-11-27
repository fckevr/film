import '@styles/globals.css';
export const metadata = {
    title: 'All Films',
    description: 'The best sex movies are here! With high 1080p quality, fast transmission speed, diverse content, genres, and quality actors'
}

const AllLayout = ({children}) => {
    return (
        <div className='w-full flex-center'>{children}</div>
    )
}

export default AllLayout