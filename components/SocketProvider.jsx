"use client"
import { useSession } from "next-auth/react";
import { createContext, useEffect, useState } from "react"
import { io } from "socket.io-client";
export const SocketContext = createContext()
const SocketProvider = ({children}) => {
    const {data: session} = useSession();
    const [listConversation, setListConversation] = useState([])
    const [watchlist, setWatchList] = useState([])
    const [socket, setSocket] = useState(null)
    const [newConversationSender, setNewConversationSender] = useState(false)
    const [newConversationReceiver, setNewConversationReceiver] = useState(false)
    // connect to socket
    useEffect(() => {
        const getAllConversations = async () => {
            const response = await fetch('/api/conversation/' + session.user.id)
            const conversations = await response.json()

            setListConversation(conversations)
            const memberChatList = []
            for (let c of conversations) {
                if (c.members.length > 0) {
                    c.members.forEach((m) => {
                        if (m._id != session.user.id) {
                            memberChatList.push(m._id)
                        }
                    })
                }            
            };
            setWatchList(memberChatList)
        }
        if (session?.user || newConversationSender || newConversationReceiver) {
            getAllConversations()
        }
    }, [session?.user, newConversationReceiver, newConversationSender])
    useEffect(() => {
        const socketInitialize = async () => {  
            const socket = io(undefined, {
                path: '/api/socket',
            })
            setSocket(socket)
        }

        socketInitialize()

        const handleBeforeUnload = (event) => {
            if (socket) {
                socket.disconnect();
            }
        };
    
        // Đăng ký trình xử lý sự kiện
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
            // Hủy đăng ký trình xử lý sự kiện
            window.removeEventListener('beforeunload', handleBeforeUnload);
    
            if (socket) {
                socket.disconnect();
            }
        };
    }, [])

    useEffect(() => {
        if (listConversation.length - 1 == watchlist.length && socket) {
            const dataConnection = {
                'watchlist': watchlist,
                'userId': session.user.id,
                'conversationList': listConversation.map(c => c._id)
            }
            socket.emit('join', dataConnection)
        }     
        
    }, [watchlist.length, listConversation.length, socket])

    const updateNewConSender = (newValue) => {
        setNewConversationSender(newValue)
    }

    const updateNewConReceiver = (newValue) => {
        setNewConversationReceiver(newValue)
    }

    const updateListConversation = (newValue) => {
        setListConversation(newValue)
    }
    return (
        <SocketContext.Provider value={{socket, listConversation, updateListConversation, updateNewConReceiver, updateNewConSender, newConversationSender}}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider