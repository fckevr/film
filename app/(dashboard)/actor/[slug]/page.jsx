"use client"
import Pagination from "@components/Pagination"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

const ActorPage = () => {
    const params = useParams()
    const [film, setFilm] = useState([])
    const [actor, setActor] = useState({
        name: "",
        avatar: "",
        info: ""
    })
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const getData = async () => {
            const response = await fetch("/api/film/search?actor=" + params.slug)
            if (response.ok) {
                const data = await response.json()
                setFilm(data)
            } 
            else {
                setLoading(false)
            }   
        }
        const getActor = async () => {
            const response = await fetch("/api/actor/" + params.slug)
            if (response.ok) {
                const data = await response.json()
                setActor({
                    name: data[0].name,
                    avatar: data[0].avatar,
                    info: data[0].info
                })
            } 
            else {
                setLoading(false)
            }  
        }
        if (params.slug) {
            getData()
            getActor()
        }
    }, [params.slug])

    useEffect( () => {
        if (film.length > 0 || actor.name != "") {
            setLoading(false)
        }
    }, [film, actor] )
    return (
        loading ? (
            <div className="dark-200 min-h-screen w-full md:w-10/12 mt-10 rounded-2xl md:p-10 p-2">
                <div className="snippet" data-title="dot-elastic">
                    <div className="stage">
                        <div className="dot-elastic m-auto"></div>
                    </div>
                </div>
            </div>
        ) : (
            actor.name ? (
                <div className="md:w-10/12 w-full">
                    <Pagination title={actor.name} items={film} actor={actor}></Pagination>
                </div>
            ) : (
                <div className="dark-200 min-h-screen w-full md:w-10/12 mt-10 rounded-2xl md:p-10 p-2 text-white text-xl text-center">
                    Không tìm thấy diễn viên!
                </div>
            ) 
        )
        
    )
}

export default ActorPage