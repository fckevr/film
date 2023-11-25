"use client"
import Link from "next/link"
import Image from "next/image"
import { useState} from "react"
import {signOut, useSession} from 'next-auth/react'
import { useRouter } from "next/navigation"
const Nav = () => {
    const {data: session} = useSession();
    const [toggleDropdown, setToggleDropdown] = useState(false)
    const [toggleNav, setToggleNav] = useState(false)
    const [keyword, setKeyword] = useState("")
    const route = useRouter()
  return (
    <nav className="dark-400 w-full pt-2 pb-2 text-white">
        <div className="flex m-auto xl:w-2/3 flex-between w-full">
            <div className="block md:hidden cursor-pointer">
                {!toggleNav ? (
                    <Image src="/assets/images/menu.svg" alt="Menu" width={30} height={30} onClick={() => setToggleNav((prev) => !prev)}></Image>   
                ) : (
                    <Image src="/assets/images/close.svg" alt="Menu" width={30} height={30} onClick={() => setToggleNav((prev) => !prev)}></Image>
                )}

                
            </div>
            <div className="flex gap-3 md:flex-row flex-col ">
                <Link href="/" className="flex gap-2 flex-center">
                    <Image src="/assets/images/logo.svg" alt="Logo" width={30} height={30} className="object-contain"></Image>
                    <p>Phimmmmm</p>
                </Link>
                <div className="md:flex xl:mx-20 gap-10 md:flex-row md:flex-center hidden ">
                    <Link className="flex-center" href="/">Phim 1</Link>
                    <Link className="flex-center" href="/">Phim 2</Link>
                    <Link className="flex-center" href="/">Phim 3</Link>
                    <Link className="flex-center" href="/">Phim 4</Link>
                    <Link className="flex-center" href="/">Phim 5</Link>
                    <div>
                        <form method="get" action="/search" className="flex flex-center relative">
                            <input name="keyword" onChange={(e) => setKeyword(e.target.value)}  className="dark-500 outline-none rounded-lg px-3 py-2 lg:w-72 w-42" type="text" placeholder="Nhập từ khóa"></input>
                            <Image onClick={() => route.push("/search?keyword=" + keyword)} className="cursor-pointer absolute end-0 border-l-2" src="/assets/images/search.svg" alt="search" width={30} height={30}></Image>
                        </form>
                    </div>
                </div>
            </div>
            
            <div>
                {session?.user ? (
                    <div id="menu_profile" className="flex flex-center relative">
                        <div className="flex flex-center cursor-pointer" onClick={() => setToggleDropdown((prev) => !prev)}>
                            <div className="w-9 h-9 ">
                                <div className="w-9 h-9 relative">
                                {session.user.avatar != '' ? (
                                    <Image className="rounded-full object-cover" src={session.user.avatar} alt={session.user.username} layout="fill"></Image>
                                ) : (
                                    <Image src="/assets/images/profile.svg" alt="Profile" layout="fill"></Image>
                                )}
                                </div>
                            </div>
                            
                            <p className="sm:block hidden ms-1 hover:text-gray-500">{session.user.username}</p>
                        </div>

                        {toggleDropdown && (
                            <div className="dropdown">
                                <div className="font-medium">
                                    Balance: {session.user.balance}$
                                </div>
                                <Link href={"/profile/" + session.user.username} className="dropdown_link" onClick={() => setToggleDropdown(false)}>Profile</Link>
                                <Link href="/" className="dropdown_link" 
                                    onClick={() => {
                                        setToggleDropdown(false)
                                        signOut()}}>Sign Out</Link>
                            </div>
                            
                        )}
                    </div>
                ) : (
                    <div>
                        <Link href="/signin" className="flex flex-center">
                            <Image src="/assets/images/profile.svg" alt="Profile" width={30} height={30}></Image>
                            <p className="sm:block hidden ms-1">Sign In</p>
                        </Link>
                    </div>
                )}
            </div>
        </div>
        {toggleNav && (
            <div className="flex gap-3 flex-col flex-center md:hidden">
                <Link href="/">Phim 1</Link>
                <Link href="/">Phim 2</Link>
                <Link href="/">Phim 3</Link>
                <Link href="/">Phim 4</Link>
                <Link href="/">Phim 5</Link>
                <div>
                    <form method="get" action="/search" className="flex flex-center relative">
                        <input name="keyword" onChange={(e) => setKeyword(e.target.value)} className="rounded-lg px-3 py-2 w-fit" type="text" placeholder="Enter something..."></input>
                        <Image onClick={() => route.push("/search?keyword=" + keyword)} className="absolute end-0 border-l-2" src="/assets/images/search.svg" alt="search" width={30} height={30}></Image>
                    </form>
                </div>
            </div>
        )}
    </nav>
  )
}

export default Nav