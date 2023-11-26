import Image from "next/image"
import Link from "next/link"
import dns from 'dns'
async function getData() {
    dns.setDefaultResultOrder('ipv4first');
    let response = await fetch(process.env.APP_URL + "/api/actor/all", {next: {revalidate: 3600}})
    if (response.ok) {
        const allActor = await response.json()
        const actorListByName = []
        let subList = []
        let currentLetter = '0'
        allActor.map((actor, index) => {
            if (actor.name[0] != currentLetter) {
                currentLetter = actor.name[0]
                if (subList.length > 0) {
                    actorListByName.push(subList)
                    subList = []
                }
            }
            subList.push(actor)
            if (index == allActor.length - 1) {
                actorListByName.push(subList)
                subList = []
            }
        })
        return actorListByName
    }
    else {
        throw new Error("Error")
    }
}

async function ActorList() {
    let actorListByName = []
    try {
        actorListByName = await getData()
    } catch (error) {
        actorListByName = []
    }
    return (
        <section className="w-full min-h-screen md:w-10/12 flex lg:gap-10 mt-10 relative">
            <div className="w-full dark-200 shadow-2xl rounded-2xl px-6 py-3">
                <div className="uppercase text-white text-2xl text-center">All Stars</div>
                {actorListByName.map((list) => (
                    <div key={list[0].name[0]} id={list[0].name[0]} className="mt-10">
                        <div className="text-xl text-white uppercase font-bold">{list[0].name[0]}</div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 text-white mt-5 gap-4 cursor-pointer">
                            {list.map((actor) => (
                                <Link key={actor._id} href={"/actor/" + actor.slug} className="dark-300 rounded-lg">
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
}

export default ActorList
