"use client"
import Film from "@components/Film";
import ModalReport from "@components/ModalReport";
import ModalResult from "@components/ModalResult";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const WatchFilm = () => {
  const route = useRouter()
  const {data: session, update} = useSession();
    const params = useParams()
    const [film, setFilm] = useState({
      id: "",
      name: "",
      code: "",
      actor: [],
      category: [],
      producer: [],
      showTag: "",
      tags: [],
      link: [],
      thumbnail: "",
      description: "",
      like: 0,
      dislike: 0,
      view: 0
    })
    const [randomFilm, setRandomFilm] = useState([])
    useEffect(() => {
        const getFilm = async () => {
          let response = await fetch("/api/film/" + params.slug)
          if (response.ok) {
            const film = await response.json()
            setFilm({
              id: film._id,
              name: film.name,
              code: film.code,
              actor: film.actor,
              category: film.category,
              producer: film.producer,
              showTag: film.showtag,
              tags: film.tags,
              link: film.link,
              thumbnail: film.thumbnail,
              description: film.description,
              like: film.like,
              dislike: film.dislike,
              view: film.view
            })
            if (session) {
              session.user.saved.forEach(element => {
                if (element == film._id) {
                  setSaved(true)
                }
              });
            }
          }
          else {
            throw new Error("Error");
          }
      }
      const getRandomFilm = async () => {
        let response = await fetch("/api/film/random")
        if (response.ok) {
          const randomFilm = await response.json()
          setRandomFilm(randomFilm)
        }
      }
      if (params.slug) {
        getFilm()
        getRandomFilm()
      }
    }, [session, params.slug])
    const [like, setLike] = useState(false)
    const [dislike, setDislike] = useState(false)
    const controlLike = () => {
      if (like) {
        film.like -= 1
      }
      else { 
        film.like += 1
      }
      setLike((like) => !like)
      if (dislike) {
        film.dislike -= 1
        setDislike(false)
      }
      handleSubmit()
    }

    const controlDislike = () => {
      if (dislike) {
        film.dislike -= 1
      }
      else {
        film.dislike += 1
      }
      setDislike((like) => !like)
      if (like) {
        film.like -= 1
        setLike(false)
      }
      handleSubmit()
    }

    function round(number) {
      const decimalPlaces = (number.toString().split('.')[1] || []).length;
      if (decimalPlaces > 2) {
        return parseFloat(number.toFixed(2));
      }
      return number;
    }

    const iframeRef = useRef(null);
    function setSrcIframe(src) {
      const iframe =  iframeRef.current
      iframe.src = src
    }
    const [saved, setSaved] = useState(false)
    const [openModalResult, setOpenModalResult] = useState(false)
    const [statusResult, setStatusResult] = useState(false)
    const [errorDetail, setErrorDetail] = useState("")
    const [action, setAction] = useState("Lưu phim")
    async function saveControl() {
      if (saved) {
        setAction("Hủy lưu phim")
        if (session) {
          const formData = new FormData()
          formData.append("id", session.user.id)
          session.user.saved.map(element => {
            if (element == film.id) {
              var index = session.user.saved.indexOf(element)
              session.user.saved.splice(index, 1)
            }
            else {
              formData.append("saved[]", element)
            }
          });
          const response = await fetch('/api/user/update', {
            method: "POST",
            body: formData
          })
          setOpenModalResult(true)
          if (response.ok) {
            await update({
              ...session
            })
            setStatusResult(true)
            setSaved((saved) => !saved)
          }
          else {
            setStatusResult(false)
          }
        }
        else {
          setOpenModalResult(true)
          setStatusResult(false)
          setErrorDetail("Please login to save film!")
        }
      }
      else {
        setAction("Lưu phim")
        if (session) {
          const formData = new FormData()
          formData.append("id", session.user.id)
          const listFilmSaved = session.user.saved
          listFilmSaved.push(film.id)
          listFilmSaved.forEach(element => {
            formData.append("saved[]", element)
          });
          const response = await fetch('/api/user/update', {
            method: "POST",
            body: formData
          })
          setOpenModalResult(true)
          if (response.ok) {
            await update({
              ...session,
              user: {
                ...session.user,
                saved: listFilmSaved
              }
            })
            setStatusResult(true)
            setSaved((saved) => !saved)
          }
          else {
            setStatusResult(false)
          }
        }
        else {
          setOpenModalResult(true)
          setStatusResult(false)
          setErrorDetail("Please login to save film!")
        }
      }
      
    }
    const [report, setReport] = useState(false)
    const onReported = (status) => {
      setAction("Report film")
      setOpenModalResult(true)
      if (status) {
        setStatusResult(true)
      }
      else {
        setStatusResult(false)
      }
    }
    // update data
    async function handleSubmit() {
      const formData = new FormData();
     // lấy danh sách diễn viên, thể loại, nsx
      for (let i = 0; i < film.actor.length; i++) {
          formData.append("actor[]", film.actor[i]._id)
      } 
      
      for (let i = 0; i < film.producer.length; i++) {
          formData.append("producer[]", film.producer[i]._id)
      } 

      for (let i = 0; i < film.category.length; i++) {
          formData.append("category[]", film.category[i]._id)
      } 

      for (let i = 0; i < film.tags.length; i++) {
          formData.append("tags[]", film.tags[i])
      } 

      for (let i = 0; i < film.link.length; i++) {
          formData.append("links[]", film.link[i])
      } 

      formData.append("name", film.name)
      formData.append("code", film.code)
      formData.append("id", film.id)
      formData.append("showtag", film.showTag)
      formData.append("thumbnail_id", film.thumbnail)
      formData.append("description", film.description)
      formData.append("like", film.like)
      formData.append("dislike", film.dislike)
      formData.append("view", film.view)
      const response = await fetch('/api/film/createOrUpdate', {
          method: "POST",
          body: formData
      })
    }
    function viewSort(view) {
      if (view >= 1000000) {
        view = (view / 1000000).toFixed(1) + "M"
      }
      else if (view >= 1000) {
        view = (view / 1000).toFixed(1) + "K"
      }
      return view
    }
    return (
        <section className="dark-200 min-h-full w-full md:w-10/12 mt-10 rounded-2xl md:p-10 p-2">
          <h3 className="text-2xl uppercase text-white">{film.code + " - " + film.name}</h3>
          <iframe ref={iframeRef} className="mt-5 w-full rounded-xl aspect-video" src="https://www.youtube.com/embed/0tFUfuEhh28?si=6nFbm4mhu_DOWhkH" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;" allowFullScreen></iframe>
          <div className="flex justify-between  mt-3">
            <div className="flex gap-3 text-dark-600">
              {film.link.map((l, index) => (
                <button key={index} className="flex dark-300 px-3 py-2 rounded-md " onClick={() => setSrcIframe(l)}>
                  #{index+1}
                </button>
              ))}
            </div>
            <div className="flex flex-end flex-wrap justify-between gap-5 text-dark-600">
              <button onClick={() => controlLike()} className="flex flex-center gap-2 dark-300 px-3 py-2 rounded-md">
                <Image src={like ? "/assets/images/liked.svg" : "/assets/images/like.svg"} width={20} height={15}/>
                {film.like}
              </button>
              <button onClick={() => controlDislike()} className="flex flex-center gap-2 dark-300 px-3 py-2 rounded-md">
                <Image src={dislike ? "/assets/images/disliked.svg" : "/assets/images/dislike.svg"} width={20} height={15}/>
                {film.dislike}
              </button>
              <div className="dark-300 px-3 py-2 flex flex-center rounded-md gap-2">
                <Image src={"/assets/images/heart.svg"} width={20} height={15}></Image>
                {(film.like + film.dislike) != 0 ? round((film.like/(film.like + film.dislike)) * 100) : 0} %
              </div>
              <div className="dark-300 px-3 py-2 flex flex-center rounded-md gap-2">
                <Image src={"/assets/images/view.svg"} width={20} height={15}></Image>
                {viewSort(film.view)}
              </div>
              <button onClick={() =>saveControl()} className="flex flex-center gap-2 dark-300 px-3 py-2 rounded-md">
                {saved ? (
                  <Image src={"/assets/images/saved.svg"} width={20} height={15}></Image>
                ) : (
                  <Image src={"/assets/images/save.svg"} width={20} height={15}></Image>
                )}
              </button>
              <button onClick={() => setReport(true)} className="flex flex-center gap-2 dark-300 px-3 py-2 rounded-md">
                <Image src={"/assets/images/report.svg"} width={20} height={15}></Image>
              </button>
            </div>
          </div>
          <p className="border-top-custom mt-5"></p>
          <div className="flex mt-5 gap-10">
            <div className="hidden lg:block w-1/4">
              <div className="relative w-full rounded-lg aspect-video"> 
                <Image className="rounded-lg" src={thumbnail.includes("//") ? thumbnail : "/assets/thumbnail/" + thumbnail} objectFit="cover" layout="fill" alt={film.name}></Image>
              </div>
              <div className="flex flex-center gap-2 flex-wrap mt-2 text-dark-600">
                <p>Porn Star: </p>
                {film.actor.map((a) => (
                  <div key={a._id} className="text-dark-600 border-custom px-2 py-1 rounded-md uppercase">
                    {a.name}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-dark-600 lg:w-3/4 w-full">
              {film.description} 
            </div>
          </div>
          <div className="flex flex-center gap-2 flex-wrap mt-5 text-dark-600">
            <p>Tags: </p>
            <div onClick={() => route.push("/search?keyword=" +film.code)} className="text-dark-600 flex flex-center gap-2 dark-300 px-2 py-1 rounded-md cursor-pointer">
              <Image src={"/assets/images/tag.svg"} width={20} height={15}></Image>
              {film.code}
            </div>
            
            {film.actor.map(a =>(
              <div key={a._id} onClick={() => route.push("/search?keyword=" + a.code)} className="text-dark-600 flex flex-center gap-2 dark-300 px-2 py-1 rounded-md cursor-pointer">
                <Image src={"/assets/images/tag.svg"} width={20} height={15}></Image>
                {a.name}
            </div>
            ))}
            {film.producer.map(p => (
              <div key={p._id} className="text-dark-600 flex flex-center gap-2 dark-300 px-2 py-1 rounded-md cursor-pointer">
                <Image src={"/assets/images/tag.svg"} width={20} height={15}></Image>
                {p.name}
              </div>
            ))}
            {film.category.map(c => (
              <div key={c._id} className="text-dark-600 flex flex-center gap-2 dark-300 px-2 py-1 rounded-md cursor-pointer">
                <Image src={"/assets/images/tag.svg"} width={20} height={15}></Image>
                {c.name}
              </div>
            ))}
            {film.tags.map((t, index) => (
              <div key={index} onClick={() => route.push("/search?keyword=" +t)} className="text-dark-600 flex flex-center gap-2 dark-300 px-2 py-1 rounded-md cursor-pointer">
                <Image src={"/assets/images/tag.svg"} width={20} height={15}></Image>
                {t}
              </div>
            ))}
          </div>
          <p className="border-top-custom mt-10"></p>
          <div className="flex flex-wrap gap-5 flex-center mt-7">
            {randomFilm.map(film => (
              <div key={film._id} className="lg:w-1/5 w-1/3 aspect-video h-auto" style={{ minHeight: "170px" }}>
                <Link href={film.slug}>
                  <Film flex={"y"} name={film.name} tag={film.showtag} thumbnail={film.thumbnail} key={film._id}></Film>
                </Link>
              </div>
            ))}
          </div>
          <ModalReport isOpen={report} onClose={() => setReport(false)} filmId={film.id} onReported={onReported}></ModalReport>
          <ModalResult isOpen={openModalResult} onClose={() => setOpenModalResult(false)} result={statusResult} action={action} errorDetail={errorDetail}></ModalResult>
        </section>
  )
}
export default WatchFilm
