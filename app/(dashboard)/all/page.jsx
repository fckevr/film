"use client"
import Pagination from "@components/Pagination"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const AllFilm = () => {
  const path = usePathname()
  const [film, setFilm] = useState([])
  const [filterFilm, setFilterFilm] = useState([])
  const [actor, setActor] = useState([])
  const [category, setCategory] = useState([])
  const [producer, setProducer] = useState([])
  const [filterActor, setFilterActor] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [filterProducer, setFilterProducer] = useState("")
  useEffect(() => {
    const getFilm = async () => {
      let response = await fetch("/api/film/all")
      if (response.ok) {
        const allFilm = await response.json()
        setFilm(allFilm)
        setFilterFilm(allFilm)
      }
      else
      {
        throw new Error("Error")
      }
    }

    const getActor = async () => {
      let response = await fetch("/api/actor/all")
      if (response.ok) {
        const allActor = await response.json()
        setActor(allActor)
      }
      else
      {
        throw new Error("Error")
      }
    }

    const getCategory = async () => {
      let response = await fetch("/api/category/all")
      if (response.ok) {
        const allCategory = await response.json()
        setCategory(allCategory)
      }
      else
      {
        throw new Error("Error")
      }
    }

    const getProducer = async () => {
      let response = await fetch("/api/producer/all")
      if (response.ok) {
        const allProducer = await response.json()
        setProducer(allProducer)
      }
      else
      {
        throw new Error("Error")
      }
    }

    if (path == "/all") {
      getFilm()
      getActor()
      getProducer()
      getCategory()
    }
  }, [])
  
  useEffect(() => {
    let filtered = []
    if (filterActor != "" && filterCategory != ""  && filterProducer != "") {
      filtered = film.filter((f) => {
        return f.category.includes(filterCategory) && f.actor.includes(filterActor) && f.producer.includes(filterProducer)
      })
    }
    else if (filterActor != "" && filterCategory != "") {
      filtered = film.filter((f) => {
        return f.category.includes(filterCategory) && f.actor.includes(filterActor)
      })
    }
    else if (filterActor != "" && filterProducer != "") {
      filtered = film.filter((f) => {
        return f.producer.includes(filterProducer) && f.actor.includes(filterActor)
      })
    }
    else if (filterCategory != "" && filterProducer != "") {
      filtered = film.filter((f) => {
        return f.category.includes(filterCategory) && f.producer.includes(filterProducer)
      })
    }
    else if (filterActor != "") {
      filtered = film.filter((f) => {
        return f.actor.includes(filterActor)
      })
    }
    else if (filterCategory != "") {
      filtered = film.filter((f) => {
        return f.category.includes(filterCategory)
      })
    }
    else if (filterProducer != "") {
      filtered = film.filter((f) => {
        return f.producer.includes(filterProducer)
      })
    }
    else {
      filtered = film
    }
    setFilterFilm(filtered)
  }, [filterActor, filterCategory, filterProducer])
  return (
        <section className="w-full dark-200 min-h-screen  md:w-10/12 mt-10 rounded-2xl md:p-10 p-2">
          <div className="flex sm:flex-row flex-col w-full justify-between max-h-max">
            <div className="sm:w-1/4 w-full flex flex-col">
              <label  className="text-white">Category</label>
              <select onChange={(e) => setFilterCategory(e.target.value) } className="dark-500 hover:dark-600 px-2 py-1 rounded-md outline-none text-white">
                <option className="text-black" value={""}>All</option>
                {category.map((c) => (
                  <option className="text-black" value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="sm:w-1/4 w-full flex flex-col">
              <label className="text-white">Channel</label>
              <select onChange={(e) => setFilterProducer(e.target.value)} className="dark-500 hover:dark-600 px-2 py-1 rounded-md outline-none text-white">
                <option className="text-black" value={""}>All</option>
                {producer.map((p) => (
                  <option className="text-black" value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="sm:w-1/4 w-full flex flex-col">
              <label className="text-white">Porn Star</label>
              <select onChange={(e) => setFilterActor(e.target.value)} className="dark-500 hover:dark-600 px-2 py-1 rounded-md outline-none text-white">
                <option className="text-black" value={""}>All</option>
                {actor.map((a) => (
                  <option className="text-black" value={a._id}>{a.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <Pagination title={"All Films"} items={filterFilm}></Pagination>
          </div>
        </section>
    ) 
}

export default AllFilm
