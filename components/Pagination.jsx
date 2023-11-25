"use client"
import { useEffect, useState } from "react"
import Film from "./Film"
import Link from "next/link"
import Image from "next/image"

const Pagination = ({title, items, actor}) => {
    const [filterFilm, setFilterFilm] = useState([])
    const [currentPage, setCurrentPage] = useState() 
    const [film, setFilm] = useState([])
    const [loading, setLoading] = useState(true)
    const [pages, setPages] = useState([])
    const [listPageShow, setListPageShow] = useState([])
    function onPageChange(page) {
        setLoading(true)
        setCurrentPage(page)
        if (filterFilm.length > 0) {
            const filmShow = filterFilm.slice((page - 1)*20, page*20)
            setFilm(filmShow)
        }
        else {
            setLoading(false)
        }
        if (pages.length > 5) {
            if (page == 1 || page == 2) {
                setListPageShow([...pages.slice(0, 5)])
            }
            else if (page == pages.length || page == pages.length - 1) {
                setListPageShow([...pages.slice(pages.length - 5)])
            }
            else {
                const index = pages.indexOf(page)
                setListPageShow([...pages.slice(index - 2, index + 3)])
            }
        }
    }
    // tính số trang cho lần đầu
    useEffect(() => {
        if (items.length > 0) {
            setFilterFilm(items)
        } 
        if (items.length == 0) {
            setFilterFilm([])
            setFilm([])
            setListPageShow([])
        }
    }, [items])
    
    useEffect(() => {
        if (filterFilm.length > 0) {
            if (film.length > 0) {
                setLoading(false)
            }
        }
        else if (pages.length != 0 && film.length == 0 && listPageShow.length == 0) {
            setLoading(false)
        }
        else {
            setLoading(true)
        }
    }, [film])

    // khi filter
    useEffect(() => {
        if (filterFilm.length > 0) {
            const pagesCount = Math.ceil(filterFilm.length/20)
            if (pagesCount !== 1 ) {
                const pageArr = Array.from({length: pagesCount}, (_, i) => i + 1)
                setPages(pageArr)
                if (pagesCount > 5) {
                    setListPageShow([...pageArr.slice(0,5)])
                }
                else {
                    setListPageShow([...pageArr])
                }
            }
            onPageChange(1)
        }
    }, [filterFilm])

    function orderFilm(order) {
        if (order == 0) {
            setFilterFilm([...filterFilm.sort((a, b) => {
                const time_a = new Date(a.createdAt)
                const time_b = new Date(b.createdAt)
                return time_b - time_a
            })])
        }
        else if (order == 1) {
            setFilterFilm([...filterFilm.sort((a, b) => {
                return b.view - a.view
            })])
        }
        else if (order == 2) {
            setFilterFilm([...filterFilm.sort((a, b) => {
                const a_like = (a.like + a.dislike) > 0 ? a.like / (a.like + a.dislike) : 0
                const b_like = (b.like + b.dislike) > 0 ? b.like / (b.like + b.dislike) : 0
                return b_like - a_like   
            })])
        }
    }
    return (
        <section className="dark-200 min-h-screen w-full mt-10 rounded-2xl md:p-10 p-2">
            {actor ? (
                <div className="flex gap-10">
                    <div className="m-auto w-full lg:w-1/4">
                        <Image className="rounded-full m-auto" src={"https://drive.google.com/uc?export=view&id=" + actor.avatar} width={100} height={100}></Image>
                        <div className="uppercase text-white text-xl text-center mt-2">{actor.name}</div>
                    </div>
                    <div className="hidden lg:block w-3/4 text-dark-600">
                        {actor.info}
                    </div>
                </div>
            ) : (
                <div className="flex justify-between ">
                    <div className="uppercase text-lg text-white">{title}</div>
                    <div>
                        <select onChange={(e) => orderFilm(e.target.value)} className="dark-500 hover:dark-600 px-2 py-1 rounded-md outline-none text-white">
                            <option value={0} className="rounded-md text-black">Sort</option>
                            <option value={1} className="rounded-md text-black">View</option>
                            <option value={2} className="rounded-md text-black">Like</option>
                        </select>
                    </div>
                </div>
            )}
            <div>
                {actor ? (
                    <div className="flex justify-between text-white mt-10 border-top-custom">
                        <div className="uppercase text-lg mt-5">Film's {actor.name}</div>
                        <div className="mt-5">
                            <select onChange={(e) => orderFilm(e.target.value)} className="dark-500 hover:dark-600 px-2 py-1 rounded-md outline-none text-white">
                                <option value={0} className="rounded-md text-black">Sort</option>
                                <option value={1} className="rounded-md text-black">View</option>
                                <option value={2} className="rounded-md text-black">Like</option>
                            </select>
                        </div>
                    </div>
                ) : (<></>)}
                {loading ? (
                    <div className="mt-10 border-top-custom flex-center">
                        <div class="snippet mt-10" data-title="dot-elastic">
                            <div class="stage">
                                <div class="dot-elastic"></div>
                            </div>
                        </div>
                    </div>
                ) : (   
                    film.length > 0 ? (
                    <div className="min-h-screen">
                        <div className={actor ? "grid grid-cols-12 gap-4" :  "grid grid-cols-12 gap-4 mt-10 border-top-custom"} >
                            {film.map(f => (
                            <div className="mt-10 w-full md:col-span-3 col-span-6 aspect-video" style={{ minHeight: "200px" }}>
                                <Link href={"/" + f.slug}>
                                    <Film name={f.name} thumbnail={f.thumbnail} flex={"y"} tag={f.showtag} key={f._id}></Film>
                                </Link>
                            </div>
                            ))}   
                        </div>
                    </div>
                    ) : (
                        <div className="mt-10 border-top-custom flex-center">
                            <div className="mt-10 text-lg text-dark-600">Not found!</div>
                        </div>
                    )  
                )}

                {listPageShow.length > 0 ? (
                    <ul className="flex gap-4 mt-10 flex-center">
                        <li onClick={() => onPageChange(1)}  className="rounded-xl dark-300 text-dark-600 px-3 py-1 cursor-pointer">
                            &laquo;
                        </li>
                        {listPageShow.map(page => (
                            <li onClick={() => onPageChange(page)} key={page} className={page === currentPage ? "rounded-xl primary-300 text-white px-3 py-1 cursor-pointer" : "rounded-xl dark-300 text-dark-600 px-3 py-1 cursor-pointer"}>
                                {page}
                            </li>
                        ))}
                        <li onClick={() => onPageChange(pages.length)}  className="rounded-xl dark-300 text-dark-600 px-3 py-1 cursor-pointer">
                            &raquo;
                        </li>
                    
                    </ul>           
                ) : (
                    <></>
                )}     
            </div>
        </section>
  
    )
}

export default Pagination