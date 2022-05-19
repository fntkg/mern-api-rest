import server from "../../server";
import mongoose from "mongoose";
import User from "../users/userModel";
import Message from "../messages/messageModel";
const chatMessage = require('./chatModel')

let io = require("socket.io")(server)

/*
    AQUI VOY PONIENDO LO QUE ENCUENTRO CON SOCKET IO
    Para hacer conversaciones privadas esta el concepto de habitaciones:
        https://socket.io/docs/v4/rooms/#default-room
    Aqui hay un ejemplo que usa socket.io y guarda los mensajes en la bbdd
        https://github.com/geepalik/chat-app/blob/master/server/index.js
 */

io.on("connection", (socket) => {
    console.log("Connection established")

    // TODO Mirar como sacar los últimos mensajes
    /*
    getMostRecentMessages()
        .then( results => {
            socket.emit("mostRecentMessages", results.reverse())
        })
        .catch(error => {
            socket.emit("mostRecentMessages", []);
        });
     */

    socket.on('join', roomName => {
        let split = roomName.split('--with--'); // ['username2', 'username1']
        let unique = [...new Set(split)].sort((a, b) => (a < b ? -1 : 1)); // ['username1', 'username2']
        let updatedRoomName = `${unique[0]}--with--${unique[1]}`; // 'username1--with--username2'

        Array.from(socket.rooms)
            .filter(it => it !== socket.id)
            .forEach(id => {
                socket.leave(id)
                socket.removeAllListeners('newChatMessage')
            });
        socket.join(updatedRoomName)

        getAllMessagesFromUser(split, unique[0]).then( result =>
            socket.to(socket).emit("chatMessages",result.get(unique[0], result.get(unique[1])))
        )

        socket.on('newChatMessage', msg => {
            Array.from(socket.rooms)
                .filter(it => it !== socket.id)
                .forEach(id => {
                    // Save message
                    chatMessage.create({
                        producer: unique[0],
                        consumer: unique[1],
                        date: Date.now(),
                        content: msg
                    }).then(
                        // Emit message
                        r => socket.to(id).emit('onMessage', msg))
                })

            socket.on("disconnect",()=>{
                console.log("connection disconnected")
            })
        })
    })
})

/*
    Return 10 most recent messages from a room
 */
async function getMostRecentMessages() {
    return chatMessage.find()
}

//Recoger mensajes
async function getAllMessagesFromUser(user, UserID){
    const users = []
    const messagesPerUser = new Map()
    await chatMessage.find({$or:[{producer: user[0], consumer: user[1]},
                                {producer: user[1], consumer: user[0]}]})
    .sort({field: "ascending"})
    .exec( function(err, messages){
        messages.forEach( (message) => {
            const otherUser = UserID === messages.producer ? messages.consumer : messages.producer
            if (messagesPerUser.has(otherUser)){
                messagesPerUser.get(otherUser).push(message)
            }else {
                messagesPerUser.set(otherUser, [message])
            }
        })
    })
    return messagesPerUser
}