"use client"
import '@styles/globals.css';
import ChatPageLayout, { SocketContext } from "@app/(dashboard)/chat/layout";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import * as faceapi from 'face-api.js';

const CallPage = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const myvideo = useRef(null);
    const otherVideo = useRef(null);
    const {socket} = useContext(SocketContext);
    const [mic, setMic] = useState(true);
    const [camera, setCamera] = useState(true);
    const [filter, setFilter] = useState(true);
    const [endCall, setEndCall] = useState(false);
    var localStream = useRef(null);
    const loadModels= async () => {
        const MODEL_URL = '/models/';
        await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
        await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
    }
    loadModels();
    const applyFaceBlurFilter = async (video) => {
        const canvas = faceapi.createCanvasFromMedia(video);
        canvas.classList.add('absolute', 'top-0', 'left-0', 'w-full', 'h-full', 'z-30');
        video.parentElement.appendChild(canvas);
        const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.5 });
        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        faceapi.matchDimensions(canvas, displaySize);
        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video, options).withFaceLandmarks(true);
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            resizedDetections.forEach(({detection, landmarks }) => {
            const faceBox = detection.box;
            const context = canvas.getContext('2d');
            context.filter = 'blur(40px)';
            context.drawImage(video, faceBox.x, faceBox.y, faceBox.width, faceBox.height, faceBox.x, faceBox.y, faceBox.width, faceBox.height);
            context.filter = 'none';    
        });
        }, 100);
    }
    useEffect(() => {
        import("peerjs").then(({default: Peer}) => {
            const caller = () => {
                const peer = new Peer();
                navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: "user",
                }, audio: {
                    noiseSuppression: true,
                }}).then((stream) => {
                    if (localStream.current == null) { 
                        localStream.current = stream
                        myvideo.current.srcObject = localStream.current;
                        myvideo.current.onloadedmetadata = function() {
                            applyFaceBlurFilter(myvideo.current);
                        };
                    }

                    socket.on('ready-call', (id) => {
                        const call = peer.call(id, stream);
                        call.on('stream', remoteStream => {
                            if (otherVideo.current) {
                                otherVideo.current.srcObject = remoteStream;
                                otherVideo.current.onloadedmetadata = function() {
                                    applyFaceBlurFilter(otherVideo.current);
                                }
                            }
                        })
                    })    
                })
            }
    
            const receiver = () => {
                const peer = new Peer();
                peer.on('open', (id) => {
                    socket.emit('created-peer', {to: params.room_id, id: id});
                })
                peer.on('call', (call) => {
                    navigator.mediaDevices
                    .getUserMedia({ video: true, audio: true })
                    .then((stream) => {
                        if (localStream.current == null) { 
                            localStream.current = stream
                            myvideo.current.srcObject = localStream.current;
                            myvideo.current.onloadedmetadata = function() {
                                applyFaceBlurFilter(myvideo.current);
                            };
                        }
                        call.answer(stream);
                        call.on('stream', (remoteStream) => {
                            if (otherVideo.current) {
                                otherVideo.current.srcObject = remoteStream;
                                otherVideo.current.onloadedmetadata = function() {
                                    applyFaceBlurFilter(otherVideo.current);
                                }
                            }
                        });
                    });
                });
            }
            
            if (searchParams.get('caller') !== null && socket) {
                caller();
            }
            else if (searchParams.get('receiver') !== null && socket) {
                receiver();
            }
            if (socket) {
                socket.on('end-call', () => {
                    if (localStream.current) {
                        localStream.current.getTracks().forEach(track => track.stop());
                    }
                    setEndCall(true);
                })
                socket.on('filter-on', () => {
                    if (otherVideo.current.parentElement.querySelector('canvas')) {
                        otherVideo.current.parentElement.querySelector('canvas').style.display = 'block';
                    }
                    
                })
                socket.on('filter-off', () => {
                    if (otherVideo.current.parentElement.querySelector('canvas')) {
                        otherVideo.current.parentElement.querySelector('canvas').style.display = 'none';
                    }
                })
            }
        })
    }, [params, socket])

    const toogleMic = () => {
        if (localStream) {
            localStream.current.getAudioTracks()[0].enabled = !localStream.current.getAudioTracks()[0].enabled;
            setMic(prev => !prev)
        }
    }

    const toogleCamera = () => {
        if (localStream) {
            localStream.current.getVideoTracks()[0].enabled = !localStream.current.getVideoTracks()[0].enabled;
            setCamera(prev => !prev)
        }
    }

    const toogleFilter = () => {
        if (localStream) {
            setFilter(prev => !prev)
        }
    }

    useEffect(() => {
        if (socket) {
            if (filter) {
                socket.emit('filter-on', {conversation: params.room_id});
                if (myvideo.current.parentElement.querySelector('canvas')) {
                    myvideo.current.parentElement.querySelector('canvas').style.display = 'block';
                }
            }
            else {
                socket.emit('filter-off', {conversation: params.room_id});
                myvideo.current.parentElement.querySelector('canvas').style.display = 'none';
            }
        }
        
    }, [filter, socket])

    const handleEndCall = () => {
        setEndCall(true);
        socket.emit('end-call', {conversation: params.room_id, ender: searchParams.get('caller') || searchParams.get('receiver')});
    }

    return (
        endCall ? (
            <div className='dark-100 min-h-screen'>
                <h1 className='text-white flex-center text-lg p-5'>Cuộc gọi đã kết thúc</h1>
            </div>
        ) : (
        <ChatPageLayout>
            <div className="dark-100 min-h-screen">
                <div className="fixed top-0 left-0 min-w-full min-h-full">
                    <video
                        ref={otherVideo}
                        autoPlay
                        className='w-full h-full' 
                    />
                </div>
                <div className="flex gap-10 justify-between fixed bottom-5 w-auto left-1/2 transform -translate-x-1/2 dark-300 px-4 py-2 rounded-full">
                    <button onClick={toogleMic} className="bg-white rounded-full p-2">
                        {mic ? (
                            <Image src={"/assets/images/mic.svg"} width={30} height={30}></Image>
                        ) : (
                            <Image src={"/assets/images/mic_muted.svg"} width={30} height={30}></Image>
                        )}
                    </button>
                    <button onClick={toogleCamera} className="bg-white rounded-full p-2">
                        {camera ? (
                            <Image src={"/assets/images/camera.svg"} width={30} height={30}></Image>
                        ) : (
                            <Image src={"/assets/images/camera_off.svg"} width={30} height={30}></Image>
                        )}
                    </button>
                    <button onClick={toogleFilter} className="bg-white rounded-full p-2">
                        {filter ? (
                            <Image src={"/assets/images/filtered.svg"} width={30} height={30}></Image>
                        ) : (
                            <Image src={"/assets/images/filter_off.svg"} width={30} height={30}></Image>
                        )}
                    </button>
                    <button className="bg-red-500 rounded-full p-2" onClick={handleEndCall}>
                        <Image src={"/assets/images/call_end.svg"} width={30} height={30}></Image>
                    </button>
                </div>
                <div className="absolute w-1/5 bottom-28 right-0 z-10">
                    <video
                        ref={myvideo}
                        autoPlay
                        muted
                    />   
                </div>
            </div>
        </ChatPageLayout>
        )
    );
}  

export default CallPage