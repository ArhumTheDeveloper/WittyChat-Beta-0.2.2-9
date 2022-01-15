import express from 'express';
import path from 'path';
import { createServer } from "http";
import { Server } from "socket.io";


const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {});

app.use(express.static(path.join("./", '')));
var userConnections = [];
io.on("connection", (socket) => {
    console.log('socket id is', socket.id);
    socket.on("userconnect", (data) => {
        console.log("userconnect", data.displayName, data.meetingid);
        var other_users = userConnections.filter((p) => p.meeting_id == data.meetingid)
        userConnections.push({
            conncetionId: socket.id,
            user_id: data.displayName,
            meeting_id: data.meetingid
        })
        other_users.forEach((v) => {
            socket.to(v.conncetionId).emit("imform_others_about_me", {
                other_users: data.displayName,
                connId: socket.id
            })
        });
        socket.on("SDPProcess", (data) => {
            socket.to(data.to_connid).emit("SDPProcess", {
                message: data.message,
                from_connid: socket.id,

            })
        });
    });
    socket.emit("infrom_me_about_other_user",);
}
)

httpServer.listen(3000, function () {

    console.log("I am James I am running")
});