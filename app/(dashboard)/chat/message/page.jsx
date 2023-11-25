"use client"
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react"
import ZoomImage from "@components/ZoomImage";
import { CallNotification } from "@components/CallNotification";
import { SocketContext } from "./layout";
import { useSession } from "next-auth/react";
import ModalCallExcept from "@components/ModalCallExcept";
import ModalConfirm from "@components/ModalConfirm";
import ModalResult from "@components/ModalResult";


const ChatPage = () => {
    const {data: session, update} = useSession()
    const [currentConversation, setCurrentConversation]= useState(null)
    const [allCurrentMessage, setAllCurrentMessage] = useState([])
    const [onlineList, setOnlineList] = useState([])
    const [image, setImage] = useState('')
    const [openZoomImage, setOpenZoomImage] = useState(false)
    const refInputChat = useRef(null)
    const refBottomChat = useRef(null)
    const [dataSend, setDataSend] = useState({
        conversation: '',
        sender: '',
        receiver: '',
        type: 'text',
        message: ''
    })
    const {socket, listConversation, updateListConversation, updateNewConReceiver, updateNewConSender, newConversationSender} = useContext(SocketContext)
    const [receiverCall, setReceiverCall] = useState(false)
    const [receiverCallData, setReceiverCallData] = useState({})
    const [message, setMessage] = useState(null)
    const messageBoxRef = useRef(null)
    const [currentLoad, setCurrentLoad] = useState(null)
    const topMessageRef = useRef(null)
    useEffect(() => {
        if (listConversation.length > 0) {
            let newestConversation = listConversation[0]
            for (let c of listConversation) {
                if (c.type == "all" ) {
                    if (currentConversation == null) {
                        setCurrentConversation(c)
                        setDataSend({...dataSend, sender: session.user.id})
                    }
                }  
                if (c.createdAt > newestConversation.createdAt) {
                    newestConversation = c
                }           
            };
            if (newConversationSender) {
                setCurrentConversation(newestConversation)
            }
            updateNewConReceiver(false)
            updateNewConSender(false)
            setCurrentLoad(0)
        }
    }, [listConversation.length])
    
    useEffect(() => {
        if (listConversation && message) {
            const newListConversation = listConversation.map((c) => {
                if (c._id === message.conversation) {
                    if (message.conversation == currentConversation._id) {
                        setAllCurrentMessage((prevMessages) => [...prevMessages, message])
                        return {
                            ...c,
                            lastMessage: message,
                            unseen: 0,
                        };
                    }
                    return {
                        ...c,
                        lastMessage: message,
                        unseen: c.unseen + 1,
                    };
                }
                return c;
                });
            updateListConversation(newListConversation)
            setMessage(null)
        }
    }, [listConversation, message])

    useEffect(() => {
        if (socket) {
            socket.on('current-online', (data) => {
                setOnlineList((prevList) => {
                    const currentList = [...prevList]
                    for (let user of data) {
                        if (!currentList.includes(user)) {
                            currentList.push(user)
                        }
                    }
                    return currentList
                })
            })
            socket.on('online', (data) => {
                setOnlineList((prevList) => {
                    const currentList = [...prevList]
                    if (!currentList.includes(data)) {
                        currentList.push(data)
                    }
                    return currentList
                })
            })
            socket.on('offline', (data) => {
                setOnlineList((prevList) => {
                    const currentList = [...prevList]
                    currentList.splice(currentList.indexOf(data), 1)
                    return currentList
                })
            })
            socket.on('new-conversation', (data) => {
                updateNewConReceiver(true)
            })
            socket.on('receiver-call', (data) => {
                setReceiverCall(true)
                setReceiverCallData(data)
                socket.on('end-call', () => {
                    setReceiverCall(false)
                    setReceiverCallData({})
                })

            })
            socket.on('message', (data) => {    
                const message = JSON.parse(data)
                setMessage(message)
            })
        }

        return () => {
            if (socket) {
                socket.off('current-online')
                socket.off('online')
                socket.off('offline')
                socket.off('new-conversation')
                socket.off('receiver-call')
                socket.off('end-call')
                socket.off('message')
            }
        }
    }, [socket])

    const handleSubmitChat = async (e) => {
        e.preventDefault()
        refInputChat.current.disabled = true
        const response = await fetch('/api/message/send', {
            method: "POST",
            body: JSON.stringify(dataSend)
        })

        refInputChat.current.value = ""
        refInputChat.current.disabled = false
        refInputChat.current.focus()
    }

    useEffect(() => {
        if (allCurrentMessage.length > 0 && currentLoad === 0) {
            topMessageRef.current = allCurrentMessage.length > 0 ? document.getElementById(allCurrentMessage[0]._id) : null;
            refBottomChat.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }
        else if (allCurrentMessage.length > 0 && currentLoad > 0) {
            topMessageRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [allCurrentMessage, currentLoad]);
      
    useEffect(() => {
        const fetchMessages = async () => {
            const response = await fetch('/api/message/' + currentConversation._id + "/" + currentLoad);
            const messages = await response.json();
            topMessageRef.current = allCurrentMessage.length > 0 ? document.getElementById(allCurrentMessage[0]._id) : null;
            setAllCurrentMessage((prev) => [...messages, ...prev]);
        };
        
        if (currentConversation && typeof currentLoad === "number") {
            setDataSend({...dataSend, conversation: currentConversation._id})
            fetchMessages();
        }
    }, [currentConversation, currentLoad]);

    function formatDate(date) {
        const currentDate = new Date()
        const dateToFormat = new Date(date)
        const optionsFull = { 
            hour: '2-digit', 
            minute: '2-digit', 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        }; 
        const optionTime = {
            hour: '2-digit', 
            minute: '2-digit'
        }

        if (currentDate.getDate() == dateToFormat.getDate() && currentDate.getMonth() == dateToFormat.getMonth() && currentDate.getFullYear() == dateToFormat.getFullYear()) {
            return new Intl.DateTimeFormat('en-US', optionTime).format(date);
        }
        // Sử dụng Intl.DateTimeFormat để định dạng ngày giờ
        return new Intl.DateTimeFormat('en-US', optionsFull).format(date);
    }
    const [openModalAdd, setOpenModalAdd] = useState(false)
    const [findUserList, setFindUserList] = useState([])
    const [username, setUsername] = useState(null)
    const findUser = async () => {
        const response = await fetch("/api/user/find/" + username)
        if (response.ok) {
            const users = await response.json()
            setFindUserList(users)
        }
    }

    const sendHello = async (userId) => {
        const data = {
            'receiver': userId,
            'sender': session.user.id,
            'message': "Hi!",
            'conversation': ''
        }
        const response = await fetch('/api/message/send', {
            method: "POST",
            body: JSON.stringify(data)
        })

        if (response.ok) {
            updateNewConSender(true)
            setOpenModalAdd(false)
        }
    }

    const handleChangeConversation = (conversation) => {
        const newListConversation = listConversation.map(c => {
            if (c._id == conversation._id) {
                c.unseen = 0
            }
            return c
        })
        updateListConversation(newListConversation)
        setCurrentConversation(conversation)  
        setCurrentLoad(0) 
        if (allCurrentMessage.length > 0) {
            setAllCurrentMessage([])
        }
    }

    const postImage = async (e) => {
        const file = e.target.files[0]

        const formData = new FormData()
        formData.append('image', file)
        formData.append('conversation', dataSend.conversation)
        formData.append('sender', dataSend.sender)
        const response = await fetch('/api/message/upload', {
            method: "POST",
            body: formData
        })
        if (response.ok) {
            const data = await response.json()
            socket.emit('send-image', JSON.stringify(data))
        }
    }
    
    const videoCall = () => {
        const receiver = currentConversation.members.filter(m => m._id != session.user.id)[0]._id
        socket.emit('call', {conversation: currentConversation._id, caller: session.user.username, caller_id: session.user.id, receiver: receiver})
        var newCall = null
        newCall = window.open("/call/" + currentConversation._id + "?caller=" + session.user.id, "_blank", "width="+screen.width+",height="+screen.height+",top=0,left=0")
        if (!newCall) {
            newCall = window.open("/call/" + currentConversation._id + "?caller=" + session.user.id, "_blank")
        }
        newCall.onbeforeunload = () => {
            socket.emit('end-call', {conversation: currentConversation._id, ender: session.user.id})
        }
        socket.on('reject-call', () => {
            newCall.close()
        })
        socket.on('skip-call', () => {
            newCall.close()
        })
    }

    const acceptCall = () => {
        var newCall = window.open("/call/" + currentConversation._id + "?receiver=" + receiverCallData.receiver, "_blank", "width="+screen.width+",height="+screen.height+",top=0,left=0")
        if (!newCall) {
            newCall = window.open("/call/" + currentConversation._id + "?receiver=" + receiverCallData.receiver, "_blank")
        }
        newCall.onbeforeunload = () => {
            socket.emit('end-call', {conversation: currentConversation._id, ender: session.user.id})    
        }
        setReceiverCall(false)
    }

    const rejectCall = () => {
        socket.emit('reject-call', {conversation: receiverCallData.conversation, receiver_id: session.user.id})
        setReceiverCall(false)
    }

    const skipCall = () => {
        socket.emit('skip-call', {conversation: receiverCallData.conversation, receiver_id: session.user.id})
        setReceiverCall(false)
    }

    const handleLoadMessage = async () => {
        if (currentLoad != 0 && messageBoxRef.current.scrollTop == 0)   {
            setCurrentLoad((prev) => prev + 1)
        }
    }
    // handle call except
    const [openCallExcept, setOpenCallExcept] = useState(false)
    const [callExceptData, setCallExceptData] = useState({
        "text": "Unlock",
        "errorDetail": "You don't unlock video call for this conversation."
    })
    const videoCallExcept = () => {
        if (currentConversation.unlocked.includes(session.user.id) && currentConversation.unlocked.length == 1) {
            setCallExceptData({
                "text": "Unlock for " + currentConversation.members.filter(m => m._id != session.user.id)[0].username,
                "errorDetail": currentConversation.members.filter(m => m._id != session.user.id)[0].username + " don't unlock video call for this conversation."
            })
            setOpenCallExcept(true)
        }
        else {
            setOpenCallExcept(true)
        }
    }
    const handleUnlockClick = () => {
        setOpenCallExcept(false)
        setOpenModalConfirm(true)
    }
    const [openModalConfirm, setOpenModalConfirm] = useState(false)
    const [openModalResult, setOpenModalResult] = useState(false)
    const [modalResultData, setModalResultData] = useState({
        "result": false,
        "action": "Unlock video call for me",
        "errorDetail": "You don't have enough money in your balance. Please add more and try again!"
    })
    const handleUnlock = async () => {
        setOpenModalConfirm(false)
        if (currentConversation.unlocked.includes(session.user.id) && currentConversation.unlocked.length == 1) {
            const body = {
                "id": currentConversation._id,
                "unlock_id": currentConversation.members.filter(m => m._id != session.user.id)[0]._id,
                "unlock_for": "other",
                "user_id": session.user.id
            }
            if (session.user.balance >= 1.5) {
                const response = await fetch("/api/conversation", {
                    method: "POST",
                    body: JSON.stringify(body)
                })
                if (response.ok) {
                    setOpenModalResult(true)
                    setModalResultData({
                        "result": true,
                        "action": "Unlock video call for " + currentConversation.members.filter(m => m._id != session.user.id)[0].username,
                    })
                    await update({
                        ...session,
                        user: {
                        ...session.user,
                        balance: Number(session.user.balance) - Number(1.5)
                        }
                    })
                    setCurrentConversation({...currentConversation, unlocked: [...currentConversation.unlocked, currentConversation.members.filter(m => m._id != session.user.id)[0]._id]})
                }
            }
            else {
                setOpenModalResult(true)
                setModalResultData({
                    "result": false,
                    "action": "Unlock video call for " + currentConversation.members.filter(m => m._id != session.user.id)[0].username,
                    "errorDetail": "You don't have enough money in your balance. Please add more and try again!"
                })
            }
        }
        else {
            const body = {
                "id": currentConversation._id,
                "unlock_id": session.user.id,
                "unlock_for": "me",
                "user_id": session.user.id
            }
            if (session.user.balance >= 1) {
                const response = await fetch("/api/conversation", {
                    method: "POST",
                    body: JSON.stringify(body)
                })
                if (response.ok) {
                    setOpenModalResult(true)
                    setModalResultData({
                        "result": true,
                        "action": "Unlock video call"
                    })
                    await update({
                        ...session,
                        user: {
                        ...session.user,
                        balance: Number(session.user.balance) - Number(1)
                        }
                    })
                    setCurrentConversation({...currentConversation, unlocked: [...currentConversation.unlocked, session.user.id]})
                }
            }
            else {
                setOpenModalResult(true)
                setModalResultData({
                    "result": false,
                    "action": "Unlock video call",
                    "errorDetail": "You don't have enough money in your balance. Please add more and try again!"
                })
            }
        }

    }
    return (
        session?.user && currentConversation ? (
                <section className="w-full dark-200 md:w-10/12 mt-10 rounded-2xl md:p-10 p-2 relative">
                    <div className="flex gap-5 flex-col md:flex-row">
                        {/* side left */}
                        <div className="md:w-1/5 w-full pr-5 border-right-custom ">
                            <div className="border-bottom-custom left-side-chat overflow-auto">
                                {listConversation.map(c => (
                                    c.type == "all" ? (
                                        <div onClick={() => handleChangeConversation(c)} key={c._id} className={currentConversation._id == c._id ? "flex gap-3 primary-300 mt-5 px-3 py-2 rounded-xl cursor-pointer": "flex gap-3 dark-300 mt-5 px-3 py-2 rounded-xl cursor-pointer"}>
                                            <div className="w-10 h-10 flex-center my-auto">
                                                <div className="w-10 h-10 relative">
                                                    <Image src={"/assets/images/group.svg"} alt="Chat all" layout="fill" title="Chat all"></Image>
                                                </div>
                                            </div>
                                            <div className={currentConversation._id == c._id ? "md:block hidden my-auto text-dark overflow-hidden text-ellipsis" : "md:block hidden my-auto text-dark-600 overflow-hidden text-ellipsis"} key={c._id}>
                                                <div className="font-bold">All</div>
                                                {c.lastMessage != null ? (
                                                    <div className="text-ellipsis overflow-hidden text-sm whitespace-nowrap max-w-full">
                                                        <span>{c.lastMessage.sender._id == session?.user.id ? "You: " : c.lastMessage.sender.username + ": "}{c.lastMessage.type == "text" ? c.lastMessage.message : "Đã gửi một ảnh"}</span>
                                                    </div>
                                                ) : (<></>)} 
                                            </div>                 
                                        </div>
                                    ) : (
                                        c.members.map(user => (
                                            user._id != session.user.id ? (
                                                <div onClick={() => handleChangeConversation(c)} key={user._id} className={currentConversation._id== c._id ? "flex primary-300 mt-5 px-3 py-2 rounded-xl cursor-pointer relative": "flex dark-300 mt-5 px-3 py-2 rounded-xl cursor-pointer relative"}>
                                                    <div className="flex items-center w-10 h-10 relative my-auto">
                                                        <div className="w-10 h-10 relative">
                                                            <Image className="rounded-full" src={user.avatar ? "https://drive.google.com/uc?export=view&id=" + user.avatar : "/assets/images/profile.svg" } layout="fill" alt={user.username}></Image>
                                                            {
                                                                onlineList.includes(user._id) ? (
                                                                    <div>
                                                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full"></div>
                                                                    </div>
                                                                ) : (<></>)
                                                            }
                                                        </div>   
                                                    </div>
                                                    <div className={currentConversation._id == c._id ? "lg:flex lg:mx-3 hidden flex-col justify-center flex-grow text-dark overflow-hidden text-ellipsis" : "lg:flex lg:mx-3 hidden flex-col justify-center flex-grow text-dark-600 overflow-hidden text-ellipsis"}>
                                                        <div className="font-bold">{user.username}</div>
                                                        {c.lastMessage != null ? (
                                                            <div className="text-ellipsis overflow-hidden text-sm whitespace-nowrap max-w-full">
                                                                <span>{c.lastMessage.sender._id == session?.user.id ? "You: " : c.lastMessage.sender.username + ": "}{c.lastMessage.type == "text" ? c.lastMessage.message : "Send image"}</span>
                                                            </div>
                                                        ) : (<></>)}
                                                    </div>
                                                    <div className="md:flex md:static items-center absolute bottom-0 end-1">
                                                        {c.unseen > 0 && c._id != currentConversation._id ? (
                                                            <div className="flex-center w-6 h-6 rounded-full bg-red-500 text-white text-sm">{c.unseen}</div>
                                                        ) : (<></>)}
                                                    </div>
                                                </div>
                                            ) : (<div key={user._id}></div>)
                                        ))
                                    )
                                ))}
                                <div onClick={() => setOpenModalAdd(true)} className="flex gap-3 dark-300 mt-5 md:mb-5 mx-2 md:mx-0 px-3 py-2 rounded-xl cursor-pointer">
                                    <div className="w-10 h-10 flex-center my-auto">
                                        <div className="w-10 h-10 relative">
                                            <Image src={"/assets/images/add_friend.svg"} alt="Chat all" layout="fill" title="Chat all"></Image>
                                        </div>
                                    </div>
                                    <div className="my-auto text-dark-600 hidden md:block text-ellipsis overflow-hidden whitespace-nowrap max-w-full">Add friend</div>
                                </div>
                            </div>
                            <div className="hidden md:flex gap-3 mt-5 px-3 py-2 rounded-xl flex-wrap justify-center">
                                <Image className="rounded-full w-12 h-12 object-cover" src={session.user.avatar || "/assets/images/profile.svg"} height={40} width={40} alt={session.user.username}></Image>
                                <div className="my-auto font-bold text-dark-600">{session.user.username}</div>
                            </div>
                        </div>
                        {/* side right */}
                        <div className="md:w-4/5 w-full">
                            <div ref={messageBoxRef} onScroll={handleLoadMessage} style={{ height: "70vh" }} className="overflow-auto pe-5"> 
                                {allCurrentMessage.map((message, index) => {        
                                    if (message.sender._id == session?.user.id)  {
                                        if (index == 0) {
                                            const date = new Date(message.date)
                                            return (
                                                <div id={message._id} key={message._id}>
                                                    <div className="font-bold text-600 text-white flex-center mt-4">{formatDate(date)}</div>
                                                    <div className="flex justify-end gap-5 mt-4">
                                                        {message.type == "image" ? (
                                                            <Image
                                                                src={"/assets/messages/" + message.message}
                                                                alt={"Avatar of " + message.sender.username}
                                                                layout="responsive"
                                                                width={200}
                                                                height={300}
                                                                objectFit="contain"
                                                                className="max-w-sm cursor-zoom-in"
                                                                onClick={() => {setImage("/assets/messages/" + message.message); setOpenZoomImage(true)}}
                                                            />
                                                        ) : (
                                                            <div className="max-w-2xl dark-500 text-white px-4 py-2 rounded-xl">{message.message}</div>
                                                        )}
                                                        <div> 
                                                            <Image className="rounded-full w-10 h-10 object-cover" src={session.user.avatar || "/assets/images/profile.svg"} height={40} width={40} alt={session.user.username}></Image>
                                                        </div> 
                                                    </div>
                                                </div>
                                            )
                                        }
                                        else {
                                            const datePre = new Date(allCurrentMessage[index - 1].date)
                                            const dateAft = new Date(message.date)
                                            if (dateAft - datePre > (1000 * 60 * 60)) {
                                                return (
                                                    <div id={message._id} key={message._id}>
                                                        <div className="font-bold text-600 text-white flex-center mt-4">{formatDate(dateAft)}</div>                                          
                                                        <div className="flex justify-end gap-5 mt-4">
                                                            {message.type == "image" ? (
                                                                <Image
                                                                    src={"/assets/messages/" + message.message}
                                                                    alt={"Ảnh của " + message.sender.username}
                                                                    layout="responsive"
                                                                    width={200}
                                                                    height={300}
                                                                    objectFit="contain"
                                                                    className="max-w-sm cursor-zoom-in"
                                                                    onClick={() => {setImage("/assets/messages/" + message.message); setOpenZoomImage(true)}}
                                                                />
                                                            ) : (
                                                                <div className="max-w-2xl dark-500 text-white px-4 py-2 rounded-xl">{message.message}</div>
                                                            )}
                                                            <div> 
                                                                <Image className="rounded-full w-10 h-10 object-cover" src={session.user.avatar || "/assets/images/profile.svg"} height={40} width={40} alt={session.user.username}></Image>
                                                            </div>     
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            
                                            return (
                                                <div id={message._id} key={message._id} >
                                                    <div className="flex justify-end gap-5 mt-4">
                                                        {message.type == "image" ? (
                                                            <Image
                                                                src={"/assets/messages/" + message.message}
                                                                alt={"Avatar of " + message.sender.username}
                                                                layout="responsive"
                                                                width={200}
                                                                height={300}
                                                                objectFit="contain"
                                                                className="max-w-sm cursor-zoom-in"
                                                                onClick={() => {setImage("/assets/messages/" + message.message); setOpenZoomImage(true)}}
                                                            />
                                                        )
                                                        : (
                                                            <div className="max-w-2xl dark-500 text-white px-4 py-2 rounded-xl">{message.message}</div>
                                                        )}
                                                        <div> 
                                                            <Image className="rounded-full w-10 h-10 object-cover" src={session.user.avatar || "/assets/images/profile.svg"} height={40} width={40} alt={session.user.username}></Image>
                                                        </div> 
                                                    </div>
                                                </div>
                                            )
                                        }
                                    }
                                    else {
                                        if (index == 0) {
                                            const date = new Date(message.date)
                                            return (
                                                <div id={message._id} key={message._id} >
                                                    <div className="font-bold text-600 text-white flex-center mt-4">{formatDate(date.getTime())}</div>
                                                    {currentConversation.type == "all" ? (
                                                        <div className="mt-4 text-dark-600 font-bold text-sm">{message.sender.username}</div>
                                                    ) : <></>}
                                                    <div className={currentConversation.type == "all" ? "flex gap-5 mt-1" : "flex gap-5 mt-4"}>
                                                        <div>
                                                            <Image className="rounded-full w-10 h-10 object-cover" src={message.sender.avatar ? "https://drive.google.com/uc?export=view&id=" + message.sender.avatar : "/assets/images/profile.svg"} height={40} width={40} alt={message.sender.username}></Image>
                                                        </div>
                                                        {message.type == "image" ? (
                                                            <Image
                                                                src={"/assets/messages/" + message.message}
                                                                alt={"Avatar of " + message.sender.username}
                                                                layout="responsive"
                                                                width={200}
                                                                height={300}
                                                                objectFit="contain"
                                                                className="max-w-sm cursor-zoom-in"
                                                                onClick={() => {setImage("/assets/messages/" + message.message); setOpenZoomImage(true)}}
                                                            />
                                                        )
                                                        : (
                                                            <div className="max-w-2xl dark-500 text-white px-4 py-2 rounded-xl">{message.message}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        }
                                        else {
                                            const datePre = new Date(allCurrentMessage[index - 1].date)
                                            const dateAft = new Date(message.date)
                                            if (dateAft - datePre > (1000 * 60 * 60)) {
                                                return (
                                                    <div id={message._id} key={message._id} >
                                                        <div className="font-bold text-600 text-white flex-center mt-4">{formatDate(dateAft.getTime())}</div>
                                                        {currentConversation.type == "all" ? (
                                                            <div className="mt-4 text-dark-600 font-bold text-sm">{message.sender.username}</div>
                                                        ) : <></>}
                                                        <div className={currentConversation.type == "all" ? "flex gap-5 mt-1" : "flex gap-5 mt-4"}>
                                                            <div>
                                                                <Image className="rounded-full w-10 h-10 object-cover" src={message.sender.avatar ? "https://drive.google.com/uc?export=view&id=" + message.sender.avatar : "/assets/images/profile.svg"} height={40} width={40} alt={message.sender.username}></Image>
                                                            </div>
                                                            {message.type == "image" ? (
                                                                <Image
                                                                    src={"/assets/messages/" + message.message}
                                                                    alt={"Avatar of " + message.sender.username}
                                                                    layout="responsive"
                                                                    width={200}
                                                                    height={300}
                                                                    objectFit="contain"
                                                                    className="max-w-sm cursor-zoom-in"
                                                                    onClick={() => {setImage("/assets/messages/" + message.message); setOpenZoomImage(true)}}
                                                                />
                                                            )
                                                            : (
                                                                <div className="max-w-2xl dark-500 text-white px-4 py-2 rounded-xl">{message.message}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            
                                            return (
                                                <div id={message._id} key={message._id}>
                                                    {currentConversation.type == "all" ? (
                                                        <div className="mt-4 text-dark-600 font-bold text-sm">{message.sender.username}</div>
                                                    ) : <></>}
                                                    <div className={currentConversation.type == "all" ? "flex gap-5 mt-1" : "flex gap-5 mt-4"}>
                                                        <div>
                                                            <Image className="rounded-full w-10 h-10 object-cover" src={message.sender.avatar ? "https://drive.google.com/uc?export=view&id=" + message.sender.avatar : "/assets/images/profile.svg"} height={40} width={40} alt={message.sender.username}></Image>
                                                        </div>
                                                        {message.type == "image" ? (
                                                            <Image
                                                                src={"/assets/messages/" + message.message}
                                                                alt={"Avatar of " + message.sender.username}
                                                                layout="responsive"
                                                                width={200}
                                                                height={300}
                                                                objectFit="contain"
                                                                className="max-w-sm cursor-zoom-in"
                                                                onClick={() => {setImage("/assets/messages/" + message.message); setOpenZoomImage(true)}}
                                                            />
                                                        )
                                                        : (
                                                            <div className="max-w-2xl dark-500 text-white px-4 py-2 rounded-xl">{message.message}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        }
                                    } 
                                })}
                                <div ref={refBottomChat}></div>
                            </div>
                            <div className="mt-10 flex w-full items-center">
                                <div className="w-2/12">
                                    <form>
                                        <input onChange={postImage} id="selectImage" className="hidden" type="file"/>
                                        <label htmlFor="selectImage">
                                            <Image className="cursor-pointer" src={"/assets/images/image.svg"} width={50} height={50} title="Send image"></Image>
                                        </label>
                                    </form>
                                    
                                </div>
                                <form method="post" onSubmit={handleSubmitChat} className="flex gap-7 w-8/12">
                                    <input ref={refInputChat} onChange={(e) => setDataSend({...dataSend, message: e.target.value})} className="px-3 py-2 rounded-lg dark-500 text-white w-4/5" type="text" placeholder="Enter a message..."></input>
                                    <button type="submit">
                                        <Image src={"/assets/images/send.svg"} height={50} width={50} title="Send message"></Image>
                                    </button> 
                                </form>
                                {currentConversation && currentConversation.type != "all" ? (
                                    currentConversation.unlocked.includes(session.user.id) && currentConversation.unlocked.length == 2 ? (
                                        <button className="flex justify-between w-2/12 flex-end" onClick={videoCall}>
                                            <Image src={"/assets/images/call.svg"} height={50} width={50} title="Video call"></Image>
                                        </button>
                                    ) : (
                                        <button className="flex justify-between w-2/12 flex-end" onClick={videoCallExcept}>
                                            <Image src={"/assets/images/camera_lock.svg"} height={50} width={50} title="Video call not working now"></Image>
                                        </button>
                                    )
                                   
                                ) : (<></>)}
                            </div>
                        </div>
                    </div>
                    {openModalAdd ? (
                        <div tabindex="-1" className="fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%)] max-h-full">
                            <div className="relative m-auto mt-32 w-full max-w-md max-h-full">
                                <div className="relativ rounded-lg shadow dark-400">
                                    <button onClick={() => setOpenModalAdd(false)} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" >
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                    <div className="p-6 text-center">
                                        <div className="text-white">Input username</div>
                                        <div className="flex justify-evenly mt-2">
                                            <input value={username} onChange={(e) => setUsername(e.target.value)} className="rounded-md p-2 outline-none dark-500 text-white" type="text" placeholder="username"></input>
                                            <button onClick={findUser} className="dark-300 rounded-md p-2 text-white">Search</button>
                                        </div>
                                        <div>
                                            {findUserList.length > 0 ? (
                                                findUserList.map(user => (
                                                    <div key={user._id} className="flex flex-center gap-5 mt-5">
                                                        <Image className="rounded-full" src={user.avatar ? "https://drive.google.com/uc?export=view&id=" + user.avatar : "/assets/images/profile.svg"} height={30} width={30}></Image>
                                                        <span className="text-white">{user.username}</span>
                                                        <button className="flex flex-center gap-2 dark-300 p-2 rounded-md text-white" onClick={() => sendHello(user._id)}>
                                                            <span>Hi!</span>
                                                            <Image src={"/assets/images/hello.svg"} width={30} height={30}></Image>
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="mt-5 text-white">Not found!</div>
                                            )}
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (<></>)}
                    <ZoomImage isOpen={openZoomImage} onClose={() => setOpenZoomImage(false)} src={image}></ZoomImage>
                    {
                        openCallExcept ? (
                            <ModalCallExcept isOpen={openCallExcept} onClose={() => setOpenCallExcept(false)} errorDetail={callExceptData.errorDetail} text={callExceptData.text} action={handleUnlockClick}></ModalCallExcept>
                        ) : (<></>)
                    }
                    {
                        receiverCall ? (
                            <CallNotification caller={receiverCallData.caller} onAccept={acceptCall} onReject={rejectCall} onSkip={skipCall}></CallNotification>
                        ) : (<></>) 
                    }
                    {
                        openModalConfirm ? (
                            <ModalConfirm isOpen={openModalConfirm} onClose={() => setOpenModalConfirm(false)} action={handleUnlock} text={!currentConversation.unlocked.includes(session.user.id) ? "Are you sure spend 1$ to unlock video call for this conversation?" : 
                        "Are you sure spend 1.5$ to unlock video call for " + currentConversation.members.filter(m => m._id != session.user.id)[0].username + "?"}></ModalConfirm>
                        ) : (<></>)
                    }
                    {
                        openModalResult ? (
                            <ModalResult isOpen={openModalResult} onClose={() => setOpenModalResult(false)} action={modalResultData.action} result={modalResultData.result} errorDetail={modalResultData.errorDetail} ></ModalResult>
                        ) : (<></>)
                    }
                </section>
        ) : (
            <section className="w-full dark-200 min-h-screen  md:w-10/12 mt-10 rounded-2xl md:p-10 p-2">
                <div className="text-white text-center">
                    Please login to use this feature!
                </div>
            </section>
        )
        
    )
}

export default ChatPage
