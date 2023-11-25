import Film from "@components/Film"
import Link from "next/link"

async function getData() {
  try {
    const responseNewest = await fetch(process.env.APP_URL + "/api/film/newest", {next: {revalidate: 600}})
    const filmNewest = await responseNewest.json()
    
    const responseTag1 = await fetch(process.env.APP_URL + "/api/film/europe", {next: {revalidate: 600}})
    const filmTag1 = await responseTag1.json()
    
    const responseTag2 = await fetch(process.env.APP_URL + "/api/film/asia", {next: {revalidate: 600}})
    const filmTag2 = await responseTag2.json()
    
    const responseViews = await fetch(process.env.APP_URL + "/api/film/views")
    const filmViews = await responseViews.json()
    
    const films = [filmNewest, filmTag1, filmTag2, filmViews]
    
    if (filmNewest && filmTag1 && filmTag2 && filmViews) {
      return films
    } else {
      throw new Error("Error")
    }
  } catch (error) {
    throw error
  }
}

export default async function Home() {
  let data;
  try {
    data = await getData()
  } catch (error) {
    console.error("Error occurred while fetching data:", error)
    data = [[], [], [], []] // Set empty arrays as default data
  }
  
  return (
      <section className="w-full md:w-10/12 flex lg:gap-10 mt-10">
        {/* left */}
        <div className="lg:w-3/4 w-full dark-200 shadow-2xl rounded-2xl px-6 py-3">
          <div >
            <h3 className="text-2xl text-white font-bold">Newest</h3>
            <div className="grid grid-cols-12 gap-4">
              {data[0].map(film => (
                <div className="mt-10 w-full md:col-span-4 col-span-6 aspect-video" style={{ minHeight: "200px" }}>
                  <Link href={film.slug}>
                    <Film name={film.name} thumbnail={film.thumbnail} flex={"y"} tag={film.showtag} key={film._id}></Film>
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 border-t"> 
            <h3 className="text-2xl text-white mt-4 font-bold">Europe</h3>
            <div className="grid grid-cols-12 gap-4">
              {data[1].map(film => (
                <div className="mt-10 w-full md:col-span-4 col-span-6 aspect-video" style={{ minHeight: "200px" }}>
                  <Film name={film.name} thumbnail={film.thumbnail} flex={"y"} tag={film.showtag} key={film._id}></Film>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 border-t">
            <h3 className="text-2xl text-white mt-4 font-bold">Asia</h3>
            <div className="grid grid-cols-12 gap-4">
              {data[2].map(film => (
                <div className="mt-10 w-full md:col-span-4 col-span-6 aspect-video" style={{ minHeight: "200px" }}>
                  <Film name={film.name} thumbnail={film.thumbnail} flex={"y"} tag={film.showtag} key={film._id}></Film>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* right */}
        <div className="dark-200 shadow-2xl rounded-2xl px-6 py-3 hidden lg:block">
            <h3 className="text-2xl text-white font-bold">Top views</h3>
            {data[3].map(film => (
              <div className="mt-4 w-full aspect-video" style={{ height: "120px" }}>
                <Film name={film.name} thumbnail={film.thumbnail} flex={"x"} tag={film.showtag} key={film._id} view={film.view}></Film>
              </div>
            ))}
        </div>
      </section>
  )
}
