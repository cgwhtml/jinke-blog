const { socket_port } = require('../../config')
const debug = require('debug')('talk')
const mode = process.env.NODE_ENV || "development"

const http = require("http")
        .createServer(function (req, res) { })
        .listen(socket_port)
    io = require("socket.io")(http);



let onlineUsers = []        //在线用户
let onlineNumber = 0        //在线人数
let clientRanDomName = Date.now().toString(36)    //客户端随机显示的用户名

io.on("connection", function (socket) {
    debug("server socket 连接成功")
    // clientRanDomName ++
    socket.emit('login', {
        serverTime: new Date()
    })
    //用户加入
    socket.on('userJoin', ({ userId, name }) => {
        debug(`[ 用户 : ${name} ] 加入聊天室, [ 用户id : ${userId} ]`)
        if (!onlineUsers.find((user) => user.userId == userId)) {
            onlineUsers.push({
                userId,
                name
            })
            onlineNumber++
        }
        //向所有用户 托送当前登录用户
        io.emit('userJoin', { onlineNumber, userName: `吃瓜群众${clientRanDomName}` })
        debug(`[当前在线人数  : ${onlineNumber} ]`)
    })
    //监听用户消息
    socket.on('message', (messageInfo) => {
        //向所有用户 推送当前消息
        io.emit('message', messageInfo);
        debug('客户端发来消息=>', messageInfo)
    })
    //用户断开连接
    socket.on('disconnect', () => {
        debug('用户断开连接');
    })
    //用户退出
    socket.on('loginOut', ({ userId: id, name }) => {
        onlineNumber--;
        onlineUsers.splice(onlineUsers.findIndex(({ userId }) => userId == id), 1)
        io.emit('loginOut', { onlineUsers, onlineNumber, loginOutName: name })
    })
})