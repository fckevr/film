import Message from '@models/message'
import User from '@models/user'
import { connectToDB } from '@utils/database'
import { data } from 'autoprefixer'
import { Server } from 'socket.io'

const onlineUsers = new Set()
connectToDB()
const SocketHandler = (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      pingInterval: 60000,
      pingTimeout: 60000,
    })

    io.on('connection', socket => {
      let userId = null
      socket.on('join', data => {
        const watchlist = data.watchlist
        userId = data.userId
        const listConversation = data.conversationList

        socket.join(listConversation)
        socket.join(userId)

        // Check if user is already in listOnlineUser
        if (!onlineUsers.has(userId)) {
          onlineUsers.add(userId)
        } 
        const listCurrentMatch = []
        watchlist.forEach(id => {
          if (onlineUsers.has(id)) {
            listCurrentMatch.push(id)
          }
        })

        io.to(userId).emit("current-online", listCurrentMatch)

        for (const room of socket.rooms) {
          if (room !== socket.id) {
            io.to(room).emit('online', userId)
          }
        }
      })

      socket.on('disconnecting', (reason) => {
        if (!reason.match("ping timeout")) {
          for (const room of socket.rooms) {
            if (room !== socket.id) {
              io.to(room).emit('offline', userId)
            }
          }
          onlineUsers.delete(userId)
        }
      })

      socket.on('send-image', data => {
        const message = JSON.parse(data)
        io.to(message.conversation).emit('message', data)
      })

      socket.on('call', async data => {
        const receiver = data.receiver
        var now = new Date()
        await Message.updateMany({$and: [{conversation: data.conversation}, {sender: {$ne: data.caller_id}}]}, {seen: true})
        const message = await Message.create({
            conversation: data.conversation,
            sender: data.caller_id,
            type: "text",
            message: "Bắt đầu cuộc gọi video",
            date: now
        })
        const senderUser = await User.findById(data.caller_id, '_id username avatar')
        message.sender = senderUser
        io.to(data.conversation).emit('message', JSON.stringify(message))  
        io.to(receiver).emit('receiver-call', data)
      })

      socket.on('reject-call', async data => {
        var now = new Date()
        await Message.updateMany({$and: [{conversation: data.conversation}, {sender: {$ne: data.receiver_id}}]}, {seen: true})
        const message = await Message.create({
            conversation: data.conversation,
            sender: data.receiver_id,
            type: "text",
            message: "Từ chối cuộc gọi video",
            date: now
        })
        const senderUser = await User.findById(data.receiver_id, '_id username avatar')
        message.sender = senderUser
        io.to(data.conversation).emit('message', JSON.stringify(message))  
        io.to(data.conversation).emit('reject-call')
      })

      socket.on('created-peer', data => {
        const receiver = data.to
        io.to(receiver).emit('ready-call', data.id)
      })

      socket.on('end-call', async data => {
        var now = new Date()
        const message = await Message.create({
            conversation: data.conversation,
            sender: data.ender,
            type: "text",
            message: "Kết thúc cuộc gọi video",
            date: now
        })
        const senderUser = await User.findById(data.ender, '_id username avatar')
        message.sender = senderUser
        io.to(data.conversation).emit('message', JSON.stringify(message))  
        io.to(data.conversation).emit('end-call', "endcall")
      })


      socket.on("skip-call", async data => {
        const senderUser = await User.findById(data.receiver_id, '_id username avatar')
        var now = new Date()
        const message = await Message.create({
            conversation: data.conversation,
            sender: data.receiver_id,
            type: "text",
            message: "Bỏ lỡ cuộc gọi video",
            date: now
        })
        message.sender = senderUser
        io.to(data.conversation).emit('message', JSON.stringify(message))  
        io.to(data.conversation).emit('skip-call', "skipcall")
      })

      socket.on('filter-on', data => {
        io.to(data.conversation).emit('filter-on')
      })

      socket.on('filter-off', data => {
        io.to(data.conversation).emit('filter-off')
      })
    })

    res.socket.server.io = io
    
  } 
  res.end()
}

export default SocketHandler