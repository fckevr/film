"use client"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {useEffect, useState } from "react"

const UpdateReport = () => {
    const [report, setReport] = useState({
        id: '',
        film: {},
        status: ""
    })
    const route = useRouter();
    const params = useParams();
    useEffect( () => {
        const getReport = async () => {
            const response = await fetch('/api/report/' + params.id[1])
            if (response.ok) {
                const existReport = await response.json();
                setReport({
                    id: existReport._id,
                    film: existReport.film,
                    status: existReport.status
                })
            }
            else {
                route.push('/phongAdmin/report')
            }
        }

        if (params.id[1]) {
            getReport()
        }
    }, [params.id[1]])
    

    const [errorAlert, setErrorAlert] = useState(null)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData()
        formData.append("id", report.id)
        formData.append("film", report.film._id)
        formData.append("status", report.status)
        const response = await fetch('/api/report/createOrUpdate', {
            method: "POST",
            body: formData
        })
        if (response.ok) {
            setErrorAlert(null)
            route.push("/phongAdmin/report")
        }
        else {
            response.text().then(text => {
                setErrorAlert(text)
            })
        }
        
    }
    return (
        <section class=" py-1 bg-blueGray-50">
            <div class="w-full lg:w-8/12 px-4 mx-auto mt-6">
                <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
                    <div class="rounded-t bg-gray-400 mb-0 px-6 py-3">
                    <div class="text-center flex justify-between">
                        <h6 class="text-xl font-bold">
                        {params.id[0] == 'create' ? 'Thêm' : 'Cập nhật'} Báo cáo 
                        </h6>
                    </div>
                    </div>
                    <div class="px-4 lg:px-10 py-10">
                        <form onSubmit={handleSubmit} className="w-full flex-center flex-col">
                            <div class="w-full lg:w-6/12 px-4">
                                <div class="relative w-full mb-3">
                                    <label class="block uppercase text-gray-200 text-xs font-bold mb-2" htmlfor="grid-password">
                                        Tên Phim
                                    </label>
                                    <input readOnly="true" value={report.film.name} type="text" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-gray-400 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                                </div>
                                <div class="relative w-full mb-3">
                                    <label class="block uppercase text-gray-200 text-xs font-bold mb-2" htmlfor="grid-password">
                                        Code
                                    </label>
                                    <input readOnly="true" value={report.film.code} type="text" class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-gray-400 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                                </div>
                                <div class="relative w-full mb-3">
                                    <label class="block uppercase text-gray-200 text-xs font-bold mb-2" htmlfor="grid-password">
                                        Tình trạng
                                    </label>
                                    <select onChange={(e) => setReport({...report, status: e.target.value})} required className="actors border-0 px-3 py-3 bg-gray-400 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear"> 
                                        <option value={"0"} selected={report.status == "0" ? true : false}>Chưa xử lý</option>
                                        <option value={"1"} selected={report.status == "1" ? true : false}>Đang xử lý</option>
                                        <option value={"2"} selected={report.status == "2" ? true : false}>Đã xử lý</option>
                                    </select>
                                </div>
                            </div>
                            <input type="submit" role="button" className="cursor-pointer bg-black text-white px-3 py-2 rounded-xl" value={params.id[0] == 'create' ? 'Thêm' : 'Cập nhật'}/>
                            <div className="w-full lg:w-6/12 px-4 border-t mt-5 flex  justify-evenly">
                                <button className="w-1/3 cursor-pointer bg-black text-white px-3 py-2 rounded-xl mt-3">
                                    <Link href={"/" + report.film.slug} target="_blank">
                                        Mở phim
                                    </Link>
                                </button>
                                <button className="w-1/3 cursor-pointer bg-black text-white px-3 py-2 rounded-xl mt-3">
                                    <Link href={"/phongAdmin/film/update/" + report.film._id} target="_blank">
                                        Chỉnh sửa phim
                                    </Link>
                                </button>
                            </div>
                        </form>
                        {errorAlert ? (
                            <div className="text-white mt-3 bg-red-500 rounded-lg px-3 py-2">
                                {errorAlert}
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default UpdateReport
