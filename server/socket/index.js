const socketIO = require("socket.io");
const { notification, attendance, appointment, entrance } = require('./namespace');
const { readRequest } = require('./listener')

module.exports = (server, secure) => {

    const io = socketIO(server, { secure });

    io.of(notification).on("connection", async (socket) => {
        socket.join(socket.handshake.query.userId);
        await readRequest(socket);
    });

    io.of(attendance).on("connection", async (socket) => {
    });

    io.of(appointment).on("connection", async (socket) => {
    });

    io.of(entrance).on("connection", async (socket) => {
    });

    return io;
};