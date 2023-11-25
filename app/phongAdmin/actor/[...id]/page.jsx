"use client"
import { useParams, useRouter } from "next/navigation"
import {useEffect, useState } from "react"

const CreateUpdateActor = () => {
    const [avatar, setAvatar] = useState(null)
    const [actor, setActor] = useState({
        id: '',
        name: '',
        info: '',
        avatar_id: ''
    })
    const [uploaded, setUploaded] = useState(null)
    const uploadImage = (e) => {
        const imageAccept = ['jpg', 'jpeg', 'png', 'webp'];
        if (e.target.files && e.target.files[0]) {
            const fileExtension = e.target.files[0].name.split('.').pop().toLowerCase();
            if (imageAccept.includes(fileExtension)) {
                const src = URL.createObjectURL(e.target.files[0]);
                setUploaded(src)
                setAvatar(e.target.files[0])
                setErrorAlert(null)
            }
            else {
                setErrorAlert("Vui lòng chọn ảnh phù hợp với định dạng yêu cầu!")
            }
        }
    }
    const route = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false)
    useEffect( () => {
        const getActor = async () => {
            setLoading(true)
            const response = await fetch('/api/actor/' + params.id[1])
            if (response.ok) {
                const existActor = await response.json();
                setActor({
                    name: existActor.name,
                    id: existActor._id,
                    info: existActor.info,
                    avatar_id: existActor.avatar
                })
                setLoading(false)
            }
            else {
                route.push('/phongAdmin/actor/create')
            }
        }

        if (params.id[1]) {
            getActor()
        }
    }, [params.id[1]])
    

    const [errorAlert, setErrorAlert] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true)
        const formData = new FormData();
        formData.append("name", actor.name)
        formData.append("info", actor.info)
        formData.append("id", actor.id)
        if (avatar) {
            formData.append("avatar", avatar)
        }
        formData.append("avatar_id", actor.avatar_id)
        const response = await fetch('/api/actor/createOrUpdate', {
            method: "POST",
            body: formData
        })
        if (response.ok) {
            setErrorAlert(null)
            route.push("/phongAdmin/actor")
        }
        else {
            response.text().then(text => {
                setErrorAlert(text)
            })
        }
        setSubmitting(false)
        
    }
    return (
        <section class=" py-1 bg-blueGray-50">
            <div class="w-full lg:w-8/12 px-4 mx-auto mt-6">
                <div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
                    <div class="rounded-t bg-gray-400 mb-0 px-6 py-3">
                    <div class="text-center flex justify-between">
                        <h6 class="text-xl font-bold">
                        {params.id[0] == 'create' ? 'Thêm' : 'Cập nhật'} Diễn viên
                        </h6>
                    </div>
                    </div>
                    {!loading ? (
                        <div class="px-4 lg:px-10 py-10">
                        <form onSubmit={handleSubmit} className="w-full flex-center flex-col">
                            <div class="w-full lg:w-6/12 px-4">
                                <div class="relative w-full mb-3">
                                <label class="block uppercase text-gray-200 text-xs font-bold mb-2" htmlfor="grid-password">
                                    Tên Diễn viên
                                </label>
                                <input value={actor.name} type="text" onChange={(e) => setActor({ ...actor, name: e.target.value})} class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-gray-400 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                                </div>
                            </div>
                            <div class="w-full lg:w-6/12 px-4">
                                <div class="relative w-full mb-3">
                                <label class="block uppercase text-gray-200 text-xs font-bold mb-2" htmlfor="grid-password">
                                    Thông tin
                                </label>
                                <textarea rows={10} value={actor.info} type="text" onChange={(e) => setActor({ ...actor, info: e.target.value})} class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-gray-400 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                                </div>
                            </div>
                            <label className="block uppercase text-gray-200 text-xs font-bold mb-2">Avatar</label>
                                
                                {uploaded || actor.avatar_id ? (
                                    <img src={uploaded || ("https://drive.google.com/uc?export=view&id=" + actor.avatar_id)} className="rounded-full m-auto w-20 h-20 object-cover"></img>
                                
                                ) : (
                                    <></>
                                )}
                                <input accept=".jpg, .jpeg, .webp, .png" id="inputImage" type="file" name="myImage" onChange={uploadImage} hidden/>
                                <label className="mt-4 cursor-pointer bg-black text-white px-3 py-2 rounded-xl" type="button" htmlFor="inputImage">Chọn ảnh</label>
                            {!submitting ? (
                                <input type="submit" role="button" className="mt-10 cursor-pointer bg-black text-white px-3 py-2 rounded-xl" value={params.id[0] == 'create' ? 'Thêm' : 'Cập nhật'}/>
                            ) : (
                                <button className="mt-10 cursor-pointer bg-black text-white px-7 py-2 rounded-xl">
                                <div role="status">
                                    <svg aria-hidden="true" class="w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                    </svg>
                                    <span class="sr-only">Loading...</span>
                                </div>
                            </button>
                            )}
                            
                        </form>
                        {errorAlert ? (
                            <div className="text-white mt-3 bg-red-500 rounded-lg px-3 py-2">
                                {errorAlert}
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>
                    ) : (
                        <div className="flex-center mt-2" role="status">
                            <svg aria-hidden="true" class="w-10 h-10 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default CreateUpdateActor
