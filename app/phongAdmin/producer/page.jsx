"use client"
import Modal from "@components/admin/Modal";
import Link from "next/link";
import { useEffect, useState } from "react";


const ProducerManager = () => {
    const [openModal, setOpenModal] = useState(false)
    const [deleteLink, setDeleteLink] = useState('')
    const [producers, setProducers] = useState([])
    useEffect(() => {
        const fetchProducer = async () => {
            const res = await fetch('/api/producer/all')
            if (res.ok) {
                const data = await res.json()
                setProducers(data)
            }
            else {
                alert("Đã có lỗi xảy ra")
            }
        }

        fetchProducer()
    }, [])

    const onDeleted = (deleted) => {
        if (deleted) {
            const lastSlash = deleteLink.lastIndexOf('/')
            const id = deleteLink.substring(lastSlash+1)
            const newProducers = producers.filter((p) => p._id !== id)
            setProducers(newProducers)
        }
    }

    const im_export = async () => {
        const res = await fetch('/api/producer/import')
            if (res.ok) {
                alert("Hoàn thành!")
                location.reload()
            }
            else {
                alert("Đã có lỗi xảy ra")
            }
    }
    return (
        <div className="w-full">
            <div className="flex justify-between">
                <h2 className="font-bold text-xl text-white">Quản lý NSX</h2>
                <div className="flex gap-5">
                    <button className="black_btn"><Link href={"/phongAdmin/producer/create"}>Thêm NSX</Link></button>
                    <button onClick={() => im_export()} className="black_btn">Nhập - Xuất NSX</button>
                </div>
            </div>
            <div class="mt-5 w-full relative overflow-x-auto shadow-md sm:rounded-lg ">
                <table class="w-full text-sm text-center text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-500 dark:text-gray-100">
                        <tr>
                            <th scope="col" class="px-6 py-3">#</th>
                            <th scope="col" class="px-6 py-3">
                                Tên nhà sản xuất
                            </th>
                            <th scope="col" colSpan={2} class="px-6 py-3">
                                Chức năng
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {producers.map((producer, index) => (
                            <tr key={producer._id} class="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                                <td class="px-6 py-4">
                                    {index + 1}
                                </td>
                                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {producer.name}
                                </th>
                                <td class="px-6 py-4">
                                    <Link className="hover:text-yellow-300" href={"/phongAdmin/producer/update/" + producer._id}>Chỉnh sửa</Link>
                                </td>
                                <td class="px-6 py-4">
                                    <button onClick={() => {setOpenModal(!openModal); setDeleteLink("/api/producer/" + producer._id)}} className="hover:text-red-500">Xóa</button>
                                </td>
                            </tr>
                                                       
                        ))}
                    </tbody>
                </table>
                <Modal onDeleted={onDeleted} deleteLink={deleteLink} isOpen={openModal} onClose={() => setOpenModal(false)}></Modal>
            </div>
        </div>
        
    )
}



export default ProducerManager

