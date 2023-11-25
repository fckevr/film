"use client"
import { usePathname } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { CountReportContext } from "@app/phongAdmin/layout"
const SideNav = () => {
  const {countReport, updateValue } = useContext(CountReportContext)
  const [open, setOpen] = useState(true)
  const location = usePathname()
  useEffect( async () => {
    const response = await fetch("/api/report/not")
    const count = await response.json()
    updateValue(count)
  }, [])
  const Menus = [
    { title: 'Dashboard', path: '/dashboard', src:  ''},
    { title: 'Quản lý Phim', path: '/phongAdmin/film', src: ''},
    { title: 'Quản lý Diễn viên', path: '/phongAdmin/actor', src: ''},
    { title: 'Quản lý Thể loại', path: '/phongAdmin/category', src:  ''},
    { title: 'Quản lý NSX', path: '/phongAdmin/producer', src: ''},
    { title: 'Quản lý Báo cáo', path: '/phongAdmin/report', src: '', count: countReport},
    { title: 'Signin', path: '/login', src: '', gap: 'true' },
  ]

  return (
    <>
      <div
        className={`${
          open ? 'w-64' : 'w-fit'
        } hidden sm:block relative h-screen duration-300 bg-gray-100 border-r border-gray-200 dark:border-gray-600 p-5 dark:bg-slate-800`}
      >
        <button
          className={`${
            !open && 'rotate-180'
          } absolute text-3xl z-50 bg-white fill-slate-800  rounded-full cursor-pointer top-9 -right-4 dark:fill-gray-400 dark:bg-gray-800`}
          onClick={() => setOpen(!open)}><Image src={"/assets/images/back.svg"} width={30} height={30}></Image></button>
        <Link href='/'>
          <div className={`flex ${open && 'gap-x-4'} items-center`}>
            <img src="/assets/images/google.svg" alt='' className='pl-2' />
            {open && (
              <span className='text-xl font-medium whitespace-nowrap dark:text-white'>
                Admin
              </span>
            )}
          </div>
        </Link>

        <ul className='pt-6'>
          {Menus.map((menu, index) => (
            <Link href={menu.path} key={index}>
              <li
                className={`flex items-center gap-x-6 p-3 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700
                        ${menu.gap ? 'mt-9' : 'mt-2'} ${
                  location.search(menu.path) != -1 &&
                  'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`${
                    !open && 'hidden'
                  } origin-left duration-300 hover:block`}
                >
                  {menu.title}
                  {menu.count && menu.count != 0 ? (
                    <span className="mx-3 bg-red-500 rounded-full px-2 py-1">
                      {menu.count}
                    </span>
                  ) : (
                    <></>
                  )}
                  
                </span>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </>
    )
}

export default SideNav