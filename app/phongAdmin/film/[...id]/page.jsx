"use client"
import Image from "next/image"
import { useRef, useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
const CreateFilm = () => {
    const route = useRouter()
    const actorRef = useRef(null)
    const actorContainerRef = useRef(null)
    const produderRef = useRef(null)
    const producerContainerRef = useRef(null)
    const categoryRef = useRef(null)
    const categoryContainerRef = useRef(null)
    const linkRef = useRef(null)
    const linkContainerRef = useRef(null)
    const newElement = (ref, containerRef) => {
        const element = ref.current;
        const container = containerRef.current;
        if (element) {
            const copy = element.cloneNode(true)
            copy.classList.add("mt-3")
            const image = copy.querySelector("img")
            image.src = "/assets/images/remove.svg" 
            image.width = '26' 
            image.height = '26'
            image.classList.add("me-1")
            container.appendChild(copy)
            image.onclick = () => {
                copy.remove()
            }
        }
    }

    const [uploaded, setUploaded] = useState(null)
    const [thumbnail, setThumbnail] = useState(null)
    const uploadImage = (e) => {
        const imageAccept = ['jpg', 'jpeg', 'png', 'webp'];
        if (e.target.files && e.target.files[0]) {
            const fileExtension = e.target.files[0].name.split('.').pop().toLowerCase();
            if (imageAccept.includes(fileExtension)) {
                const src = URL.createObjectURL(e.target.files[0]);
                setUploaded(src)
                setThumbnail(e.target.files[0])
            }
        }
    }
    const [film, setFilm] = useState({
        id: "",
        name: "",
        code: "",
        actor: [],
        category: [],
        producer: [],
        showTag: "",
        tags: '',
        link: [],
        thumbnail_id: "",
        description: "",
        like: 0,
        dislike: 0,
        view: 0
    })
    const params = useParams();
    const [actors, setActors] = useState([])
    const [categories, setCategories] = useState([])
    const [producers, setProducers] = useState([])
    const [loading, setLoading] = useState(false)
    // lấy phim nếu sửa
    useEffect( () => {
        const getFilm = async () => {
            setLoading(true)
            const response = await fetch('/api/film/' + params.id[1])
            if (response.ok) {
                const existFilm = await response.json();
                setFilm({
                    id: existFilm._id,
                    name: existFilm.name,
                    code: existFilm.code,
                    actor: existFilm.actor,
                    category: existFilm.category,
                    producer: existFilm.producer,
                    showTag: existFilm.showtag,
                    tags: existFilm.tags.join(),
                    link: existFilm.link,
                    thumbnail_id: existFilm.thumbnail,
                    description: existFilm.description,
                    like: existFilm.like,
                    dislike: existFilm.dislike,
                    view: existFilm.view
                })
                setLoading(false)
            }
            else {
                route.push('/phongAdmin/film/create')
            }
        }

        if (params.id[1]) {
            getFilm()
        }
    }, [params.id[1]])

    // lấy danh sách các nsx, dv, thể loại
    useEffect(() => {
        const fetchActors = async () => {
            const res = await fetch('/api/actor/all')
            if (res.ok) {
                const data = await res.json()
                setActors(data)
            }
            else {
                alert("Đã có lỗi xảy ra")
            }
        }
        const fetchCategories = async () => {
            const res = await fetch('/api/category/all')
            if (res.ok) {
                const data = await res.json()
                setCategories(data)
            }
            else {
                alert("Đã có lỗi xảy ra")
            }
        }
        const fetchProducers = async () => {
            const res = await fetch('/api/producer/all')
            if (res.ok) {
                const data = await res.json()
                setProducers(data)
            }
            else {
                alert("Đã có lỗi xảy ra")
            }
        }
        fetchActors()
        fetchCategories()
        fetchProducers()
    }, [])
    const [errorAlert, setErrorAlert] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        setSubmitting(true)
       // lấy danh sách diễn viên, thể loại, nsx
        const actorsSelect = document.getElementsByClassName("actors")
        for (let i = 0; i < actorsSelect.length; i++) {
            formData.append("actor[]", actorsSelect[i].value)
        } 
        
        const producersSelect = document.getElementsByClassName("producers")
        for (let i = 0; i < producersSelect.length; i++) {
            formData.append("producer[]", producersSelect[i].value)
        } 

        const categoriesSelect = document.getElementsByClassName("categories")
        for (let i = 0; i < categoriesSelect.length; i++) {
            formData.append("category[]", categoriesSelect[i].value)
        } 

        const tags = document.getElementById("tags").value.split(",")
        for (let i = 0; i < tags.length; i++) {
            formData.append("tags[]", tags[i])
        } 

        const linksText = document.getElementsByClassName("links")
        for (let i = 0; i < linksText.length; i++) {
            formData.append("links[]", linksText[i].value)
        } 

        formData.append("name", film.name)
        formData.append("code", film.code)
        formData.append("id", film.id)
        formData.append("showtag", film.showTag)
        formData.append("thumbnail_id", film.thumbnail_id)
        formData.append("description", film.description)
        formData.append("like", film.like)
        formData.append("dislike", film.dislike)
        formData.append("view", film.view)
        if (thumbnail) {
            formData.append("thumbnail_file", thumbnail)
        }
        const response = await fetch('/api/film/createOrUpdate', {
            method: "POST",
            body: formData
        })
        if (response.ok) {
            setErrorAlert(null)
            route.push("/phongAdmin/film")
        }
        else {
            response.text().then(text => {
                setErrorAlert(text)
            })
        }
        setSubmitting(false)
        
    }
    return (
        <section className=" py-1 bg-blueGray-50">
             <title>Quản lý phim - Thêm Sửa</title>
            <div className="w-full lg:w-8/12 px-4 mx-auto mt-6">
            {!loading ? (
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
                <div className="rounded-t bg-gray-400 mb-0 px-6 py-3">
                <div className="text-center flex justify-between">
                    <h6 className="text-blueGray-700 text-xl font-bold">
                    {params.id[0] == 'create' ? 'Thêm' : 'Cập nhật'} Film Mới
                    </h6>
                </div>
                </div>
                <div className="flex-auto px-4 lg:px-10 py-10 ">
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-wrap">
                    <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                        <label className="block uppercase text-gray-200 text-xs font-bold mb-2" htmlFor="grid-password">
                            Tên phim
                        </label>
                        <input value={film.name} required type="text" onChange={(e) => setFilm({...film, name: e.target.value})} className="border-0 px-3 py-3 placeholder-blueGray-300 bg-gray-400 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                        </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                        <label className="block uppercase text-gray-200 text-xs font-bold mb-2" htmlFor="grid-password">
                            Code
                        </label>
                        <input value={film.code} required type="text" onChange={(e) => setFilm({...film, code: e.target.value})} className="border-0 px-3 py-3 placeholder-blueGray-300 bg-gray-400 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                        </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                        <div ref={actorContainerRef} className="relative w-full mb-3">
                            <label className="block uppercase text-gray-200 text-xs font-bold mb-2" htmlFor="grid-password">
                                Diễn viên
                            </label>
                            {(film.actor.length > 0) ? (
                                film.actor.map((a,index) => (
                                    (index == 0 ? (
                                        <div ref={actorRef} className="flex justify-between">
                                            <select required className="actors border-0 px-3 py-3 bg-gray-400 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear"> 
                                                <option>Chọn diễn viên</option>
                                                {actors.map(actor => (
                                                    <option selected={a._id == actor._id} value={actor._id}>{actor.name}</option>
                                                ) )}
                                            </select>
                                            <Image className="cursor-pointer ms-7" onClick={() => {newElement(actorRef, actorContainerRef)}} src={"/assets/images/add.svg"} width={35} height={35}></Image>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between mt-3">
                                            <select required className="actors border-0 px-3 py-3 bg-gray-400 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear"> 
                                                <option>Chọn diễn viên</option>
                                                {actors.map(actor => (
                                                    <option selected={a._id == actor._id} value={actor._id}>{actor.name}</option>
                                                ) )}
                                            </select>
                                            <Image className="cursor-pointer ms-7" onClick={(e) => {e.currentTarget.parentNode.remove()}} src={"/assets/images/remove.svg"} width={27} height={27}></Image>
                                        </div>
                                    )
                                )))
                             ) : (
                                <div ref={actorRef} className="flex justify-between">
                                    <select required className="actors border-0 px-3 py-3 bg-gray-400 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear"> 
                                        <option>Chọn diễn viên</option>
                                        {actors.map(actor => (
                                            <option value={actor._id}>{actor.name}</option>
                                        ) )}
                                    </select>
                                    <Image className="cursor-pointer ms-9" onClick={() => {newElement(actorRef, actorContainerRef)}} src={"/assets/images/add.svg"} width={35} height={35}></Image>
                                </div>
                            )}
                            
                        </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                        <div ref={producerContainerRef} className="relative w-full mb-3">
                            <label className="block uppercase text-gray-200 text-xs font-bold mb-2" htmlFor="grid-password">
                                Nhà sản xuất
                            </label>
                            {film.producer.length > 0 ? (
                                film.producer.map( (p, index) => (
                                    (index == 0 ? (
                                        <div ref={produderRef} className="flex justify-between" >
                                            <select required className="producers border-0 px-3 py-3 bg-gray-400 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear"> 
                                                <option>Chọn nhà sản xuất</option>
                                                {producers.map(producer => (
                                                    <option selected={p._id == producer._id} value={producer._id}>{producer.name}</option>
                                                ) )}
                                            </select>
                                            <Image className="cursor-pointer ms-7" onClick={() => {newElement(produderRef, producerContainerRef)}} src={"/assets/images/add.svg"} width={35} height={35}></Image>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between mt-3" >
                                            <select required className="producers border-0 px-3 py-3 bg-gray-400 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear"> 
                                                <option>Chọn nhà sản xuất</option>
                                                {producers.map(producer => (
                                                    <option selected={p._id == producer._id} value={producer._id}>{producer.name}</option>
                                                ) )}
                                            </select>
                                            <Image className="cursor-pointer ms-9" onClick={(e) => {e.currentTarget.parentNode.remove()}} src={"/assets/images/remove.svg"} width={27} height={27}></Image>
                                        </div>
                                    )
                                )))
                            ) : (
                                <div ref={produderRef} className="flex justify-between">
                                    <select required  className="producers border-0 px-3 py-3 bg-gray-400 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear"> 
                                        <option>Chọn nhà sản xuất</option>
                                        {producers.map(producer => (
                                            <option value={producer._id}>{producer.name}</option>
                                        ) )}
                                    </select>
                                    <Image className="cursor-pointer ms-7" onClick={() => {newElement(produderRef, producerContainerRef)}} src={"/assets/images/add.svg"} width={35} height={35}></Image>
                                </div>
                            )}
                            
                        </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                        <div ref={categoryContainerRef} className="relative w-full mb-3">
                            <label className="block uppercase text-gray-200 text-xs font-bold mb-2" htmlFor="grid-password">
                                Thể loại
                            </label>
                            {film.category.length > 0 ? (
                                film.category.map((c, index) => (
                                    (index == 0 ? (
                                        <div ref={categoryRef} className="flex justify-between">
                                            <select className="categories border-0 px-3 py-3 bg-gray-400 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear"> 
                                                <option>Chọn thể loại</option>
                                                {categories.map(category => (
                                                    <option selected={c._id == category._id} value={category._id}>{category.name}</option>
                                                ) )}
                                            </select>
                                            <Image className="cursor-pointer ms-7" onClick={() => {newElement(categoryRef, categoryContainerRef)}} src={"/assets/images/add.svg"} width={35} height={35}></Image>
                                        </div>
                                    ) : (
                                        <div ref={categoryRef} className="flex justify-between">
                                            <select className="categories border-0 px-3 py-3 mt-3 bg-gray-400 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear"> 
                                                <option>Chọn thể loại</option>
                                                {categories.map(category => (
                                                    <option selected={c._id == category._id} value={category._id}>{category.name}</option>
                                                ) )}
                                            </select>
                                            <Image className="cursor-pointer ms-9" onClick={(e) => {e.currentTarget.parentNode.remove()}} src={"/assets/images/remove.svg"} width={27} height={27}></Image>
                                        </div>
                                    )) 
                                ))
                            ) : (
                                <div ref={categoryRef} className="flex justify-between">
                                    <select className="categories border-0 px-3 py-3 bg-gray-400 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear"> 
                                        <option>Chọn thể loại</option>
                                        {categories.map(category => (
                                            <option value={category._id}>{category.name}</option>
                                        ) )}
                                    </select>
                                    <Image className="cursor-pointer ms-7" onClick={() => {newElement(categoryRef, categoryContainerRef)}} src={"/assets/images/add.svg"} width={35} height={35}></Image>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                            <label className="block uppercase text-gray-200 text-xs font-bold mb-2" htmlFor="grid-password">
                                Tag hiển thị
                            </label>
                            <select required onChange={(e) => setFilm({...film, showTag: e.target.value})} className="border-0 px-3 py-3 bg-gray-400 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear"> 
                                <option>Chọn tag</option>
                                <option selected={film.showTag == "Europe"} value={"Europe"}>Europe</option>
                                <option selected={film.showTag == "Asia"} value={"Asia"}>Asia</option>
                            </select>
                        </div>
                    </div>
                    </div>

                    <hr className="mt-6 border-b-1 border-blueGray-300"/>

                    <div className="flex flex-wrap mt-2">
                    <div className="w-full lg:w-12/12 px-4">
                        <div ref={linkContainerRef}  className="relative w-full mb-3">
                            <label className="block uppercase text-gray-200 text-xs font-bold mb-2" htmlFor="grid-password">
                                Link
                            </label>
                            {(film.link.length > 0) ? (
                                film.link.map((l,index) => (
                                    (index == 0 ? (
                                        <div ref={linkRef} className="flex gap-5">
                                            <input value={l} required type="text" className="links border-0 px-3 py-3 placeholder-blueGray-300 bg-gray-400 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                                            <Image className="cursor-pointer ms-7" onClick={() => {newElement(linkRef, linkContainerRef)}} src={"/assets/images/add.svg"} width={35} height={35}></Image>
                                        </div>
                                    ) : (
                                        <div className="flex gap-5 mt-4">
                                            <input value={l} required type="text" className="links border-0 px-3 py-3 placeholder-blueGray-300 bg-gray-400 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                                            <Image className="cursor-pointer ms-7" onClick={(e) => {e.currentTarget.parentNode.remove()}} src={"/assets/images/remove.svg"} width={27} height={27}></Image>
                                        </div>
                                    )
                                )))
                             ) : (
                                 <div ref={linkRef} className="flex gap-5">
                                    <input required type="text" className="links border-0 px-3 py-3 placeholder-blueGray-300 bg-gray-400 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                                    <Image className="cursor-pointer ms-7" onClick={() => {newElement(linkRef, linkContainerRef)}} src={"/assets/images/add.svg"} width={35} height={35}></Image>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="w-full lg:w-12/12 px-4">
                        <div className="relative w-full mb-3">
                        <label className="block uppercase text-gray-200 text-xs font-bold mb-2" htmlFor="grid-password">
                            Thumbnail
                        </label>
                        {uploaded || film.thumbnail_id ? (
                            <img src={uploaded || film.thumbnail_id.includes("//") ? film.thumbnail_id : "/assets/thumbnail/" + film.thumbnail_id} className="rounded-md m-auto w-56 h-40 object-cover"></img>
                        ) : (
                            <></>
                        )}
                        <input accept=".jpg, .jpeg, .webp, .png" id="inputImage" type="file" name="myImage" onChange={uploadImage} hidden/>
                        <label className="cursor-pointer bg-black text-white px-3 py-2 rounded-xl" type="button" htmlFor="inputImage">Chọn ảnh</label>
                        </div>
                    </div>
                    </div>

                    <div className="flex flex-wrap">
                        <div className="w-full lg:w-12/12 px-4">
                            <div className="relative w-full mb-3">
                                <label className="block uppercase text-gray-200 text-xs font-bold mb-2" htmlFor="grid-password">
                                    Mô tả
                                </label>
                                <textarea value={film.description} required onChange={(e) => setFilm({...film, description: e.target.value})} type="text" className="border-0 px-3 py-3 placeholder-blueGray-300 bg-gray-400 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" rows="4"/>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-12/12 px-4">
                        <div className="relative w-full mb-3">
                        <label className="block uppercase text-gray-200 text-xs font-bold mb-2" htmlFor="grid-password">
                            Tag liên quan
                        </label>
                        <input value={film.tags} onChange={(e) => setFilm({...film, tags: e.target.value})} id="tags" type="text" className="border-0 px-3 py-3 placeholder-blueGray-300 bg-gray-400 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                        </div>
                    </div>
                    <div className="flex-center">
                        {!submitting ? (
                            <input required type="submit" role="button" className="mt-10 cursor-pointer bg-black text-white px-7 py-2 rounded-xl" value={params.id[0] == 'create' ? 'Thêm' : 'Cập nhật'}/>
                        ): (
                            <button className="mt-10 cursor-pointer bg-black text-white px-7 py-2 rounded-xl">
                                <div role="status">
                                    <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                    </svg>
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </button>
                        )} 
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
        </section>
    )
}

export default CreateFilm
