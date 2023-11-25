import Image from "next/image"
import Link from "next/link"

async function getData() {
    let response = await fetch(process.env.APP_URL + "/api/actor/all", {next: {revalidate: 3600}})
    const allActor = await response.json()
    if (allActor) {
        return allActor
    } else {
        throw new Error("Error")
    }
}

export default async function ActorList() {
    try {
        const data = await getData()
        const actorListByName = []
        let subList = []
        let currentLetter = 'A'
        data.map((actor, index) => {
            if (actor.name[0] != currentLetter) {
                if (subList.length > 0) {
                    actorListByName.push(subList)
                    subList = []
                }
            }
            subList.push(actor)
            if (index == data.length - 1) {
                actorListByName.push(subList)
                subList = []
            }
        })

        return (
            <section className="w-full min-h-screen md:w-10/12 flex lg:gap-10 mt-10 relative">
                <div className="w-full dark-200 shadow-2xl rounded-2xl px-6 py-3">
                    <div className="uppercase text-white text-2xl text-center">All Stars</div>
                    {actorListByName.map((list) => (
                        <div id={list[0].name[0]} className="mt-10">
                            <div className="text-xl text-white uppercase font-bold">{list[0].name[0]}</div>
                            <div className="flex text-white mt-5 flex-wrap justify-between gap-4 cursor-pointer">
                                {list.map((actor) => (
                                    <Link key={actor._id} href={"/actor/" + actor.slug} className="dark-300 rounded-lg lg:w-1/4 md:w-1/3 w-1/2">
                                        <div className="flex text-dark-600 ">
                                            <Image className="hidden md:block rounded-s-lg" src={"https://drive.google.com/uc?export=view&id=" + actor.avatar} width={60} height={50}></Image>
                                            <div className="px-2 py-1">{actor.name}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="absolute end-2 z-50 top-1/3 px-3 py-2 rounded-xl dark-300">
                    {actorListByName.map((list) => (
                        <Link key={list[0].name[0]} href={"#" + list[0].name[0]}>
                            <div className="uppercase text-white">{list[0].name[0]}</div>
                        </Link>
                    ))}
                </div>
            </section>
        )
    } catch (error) {
        console.error(error)
        return null
    }
}