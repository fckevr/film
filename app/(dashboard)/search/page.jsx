"use client"
import Pagination from "@components/Pagination"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const SearchPage = () => {
    const req = useSearchParams()
    const [film, setFilm] = useState([])
    const [keyword, setKeyword] = useState()
    useEffect(() => {
            const getData = async () => {
            if (req.get('keyword')) {
                const response = await fetch("/api/film/search?keyword=" + req.get('keyword'))
                if (response.ok) {
                    const data = await response.json()
                    setFilm(data)
                }
            }
        }

        if (req.get('keyword')) {
            getData()
            setKeyword(req.get('keyword'))
        }
    }, [req.get('keyword')])
    return (
        <div className="w-full md:w-10/12">
            <Pagination title={keyword} items={film}></Pagination>   
        </div>
        
    )
}

export default SearchPage