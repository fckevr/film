"use client"
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export const CallNotification = ({caller, onAccept, onReject, onSkip }) => {
    const [isVisible, setIsVisible] = useState(true)
    const [action, setAction] = useState(null)
    const ringtone = useRef(null)
    useEffect(() => {
        if (isVisible) {
            setTimeout(() => {
                setIsVisible(false)
                setAction("skip")
            }, 56000)
        }
        if (!isVisible && action === "accept") {
            setTimeout(() => {
                onAccept() 
            }, 500)
            
        }
        else if (!isVisible && action === "reject") {
            setTimeout(() => {
                onReject() 
            }, 500)
        }
        else if (!isVisible && action === "skip") {
            setTimeout(() => {
                onSkip() 
            }, 500)
        }
    }, [isVisible, action])
    return (
        <div className={isVisible ? "call-notification dark-500 w-auto px-5 py-4 absolute top-0 left-1/2 transform -translate-x-1/2 rounded-md fadeIn" : "call-notification dark-500 w-auto px-5 py-4 absolute top-0 left-1/2 transform -translate-x-1/2 rounded-md fadeOut"}>
            <div className="text-center">
                <span className="caller-name text-xl">Bạn nhận được cuộc gọi từ {caller}</span>
            </div>
            <div className="caller-actions flex w-auto gap-20 flex-center mt-3">
                <button className="p-2 bg-red-500 rounded-full" onClick={() => {setIsVisible(false); setAction("reject"); ringtone.current.pause()}}>
                    <Image src={"/assets/images/call_end.svg"} width={30} height={30}></Image>
                </button>
                <button className="p-2 bg-green-500 rounded-full ring-animation" onClick={() => {setIsVisible(false); setAction("accept"); ringtone.current.pause()}}>
                    <Image src={"/assets/images/call_accept.svg"} width={30} height={30}></Image>
                </button>
            </div>
            <audio ref={ringtone} autoPlay loop src="/assets/sound/ringtone.mp3"></audio>
        </div>
    )
}