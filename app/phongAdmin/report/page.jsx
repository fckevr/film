"use client"
import Modal from "@components/admin/Modal";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { CountReportContext } from "../layout";
const ReportManager = () => {
    const { countReport, updateValue } = useContext(CountReportContext)
    const [openModal, setOpenModal] = useState(false)
    const [deleteLink, setDeleteLink] = useState('')
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchReports = async () => {
            const res = await fetch('/api/report/all')
            if (res.ok) {
                const data = await res.json()
                setReports(data)
                setLoading(false)
            }
            else {
                alert("Đã có lỗi xảy ra")
            }
        }

        fetchReports()
    }, [])

    const onDeleted = (deleted) => {
        if (deleted) {
            const lastSlash = deleteLink.lastIndexOf('/')
            const id = deleteLink.substring(lastSlash+1)
            const newReports = reports.filter((r) => r._id !== id)
            setReports(newReports)
            updateValue(countReport - 1)
        }
    }

    function convertDateFormat(datetime) {
        var dateTime = new Date(datetime)
        var time = dateTime.toLocaleTimeString([], {hour12: false})
        var date = dateTime.toLocaleDateString();
        return time + ' ' + date
    }
    return (
        <div className="w-full">
            <div className="flex justify-between">
                <h2 className="font-bold text-xl text-white">Quản lý Báo cáo</h2>
            </div>
            {!loading ? (
                <div class="mt-5 w-full relative overflow-x-auto shadow-md sm:rounded-lg ">
                    <table class="w-full text-sm text-center text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-500 dark:text-gray-100">
                            <tr>
                                <th scope="col" class="px-6 py-3">#</th>
                                <th scope="col" class="px-6 py-3">
                                    Code
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Tên phim
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Thời gian báo cáo
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Tình trạng
                                </th>
                                <th scope="col" colSpan={2} class="px-6 py-3">
                                    Chức năng
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report, index) => (
                                <tr key={report._id} class="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                                    <td class="px-6 py-4">
                                        {index + 1}
                                    </td>
                                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {report.film.code}
                                    </th>
                                    <td class="px-6 py-4">
                                        {report.film.name}
                                    </td>
                                    <td class="px-6 py-4">
                                        {convertDateFormat(report.createdAt)}
                                    </td>
                                    <td class="px-6 py-4">
                                        {report.status == "0" ? "Chưa xử lý" : report.status == "1" ? "Đang xử lý" : "Đã xử lý"}
                                    </td>
                                    <td class="px-6 py-4">
                                        <Link className="hover:text-yellow-300" href={"/phongAdmin/report/update/" + report._id}>Chỉnh sửa</Link>
                                    </td>
                                    <td class="px-6 py-4">
                                        <button onClick={() => {setOpenModal(!openModal); setDeleteLink("/api/report/" + report._id)}} className="hover:text-red-500">Xóa</button>
                                    </td>
                                </tr>
                                                        
                            ))}
                        </tbody>
                    </table>
                    <Modal onDeleted={onDeleted} deleteLink={deleteLink} isOpen={openModal} onClose={() => setOpenModal(false)}></Modal>
                </div>
            ): (
                <div className="flex-center mt-2" role="status">
                    <svg aria-hidden="true" class="w-10 h-10 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span class="sr-only">Loading...</span>
                </div>
            )}
        </div>
    )
}



export default ReportManager

