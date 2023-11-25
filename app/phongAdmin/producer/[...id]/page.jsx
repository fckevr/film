"use client"
import { useParams, useRouter } from "next/navigation"
import {useEffect, useState } from "react"

const CreateProducer = () => {
    const [producer, setProducer] = useState({
        id: '',
        name: ''
    })
    const route = useRouter();
    const params = useParams();
    useEffect( () => {
        const getProducer = async () => {
            const response = await fetch('/api/producer/' + params.id[1])
            if (response.ok) {
                const existProducer = await response.json();
                setProducer({
                    name: existProducer.name,
                    id: existProducer._id
                })
            }
            else {
                route.push('/phongAdmin/producer/create')
            }
        }

        if (params.id[1]) {
            getProducer()
        }
    }, [params.id[1]])
    

    const [errorAlert, setErrorAlert] = useState(null)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/producer/createOrUpdate', {
            method: "POST",
            body: JSON.stringify({
                name: producer.name,
                id: producer.id
            })
        })
        if (response.ok) {
            setErrorAlert(null)
            route.push("/phongAdmin/producer")
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
                        {params.id[0] == 'create' ? 'Thêm' : 'Cập nhật'} NSX 
                        </h6>
                    </div>
                    </div>
                    <div class="px-4 lg:px-10 py-10">
                        <form onSubmit={handleSubmit} className="w-full flex-center flex-col">
                            <div class="w-full lg:w-6/12 px-4">
                                <div class="relative w-full mb-3">
                                <label class="block uppercase text-gray-200 text-xs font-bold mb-2" htmlfor="grid-password">
                                    Tên NSX
                                </label>
                                <input value={producer.name} type="text" onChange={(e) => setProducer({ ...producer, name: e.target.value})} class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-gray-400 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                                </div>
                            </div>
                            <input type="submit" role="button" className="cursor-pointer bg-black text-white px-3 py-2 rounded-xl" value={params.id[0] == 'create' ? 'Thêm' : 'Cập nhật'}/>
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

export default CreateProducer
