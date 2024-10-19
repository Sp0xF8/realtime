//server.js

const express = require("express");
const app = express();
const PORT = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//New imports
const http = require("http").Server(app);
const cors = require("cors");

app.use(cors());

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
});



let map = "";

//Add this before the app.get() block
socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on('disconnect', () => {
        console.log('?: A user disconnected');
    });
});



app.post("/setmap", (req,res) => {
    const {name} = req.body;
    socketIO.emit('new_map', {name});
    console.log(name);

    map = name;

    res.status(200).json({name});
})


app.get("/getmap", (req,res) => {
    res.status(200).json({name: map});
});


app.post("/setplayers", 

    (req,res) => {
        console.log("setplayrs called");
        const {players} = req.body;
        socketIO.emit('new_players', {players});
        console.log(players);

        res.status(200).json({players});
    }
)


http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});