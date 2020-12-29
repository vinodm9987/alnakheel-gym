const socketIo = require('../');
const { notification, attendance, appointment, entrance } = require('./namespace')
const { notification: { getNotification }, attendance: { newMember }, appointment: { memberCheckedIn }, entrance: { memberEntrance } } = require('./events')


module.exports = {

  emitNotification: (data, room) => {
    socketIo.io.of(notification).to(room).emit(getNotification, data)
  },

  memberOut: (data) => {
    socketIo.io.of(attendance).emit(newMember, data)
  },

  appointmentStatus: (data) => {
    socketIo.io.of(appointment).emit(memberCheckedIn, data)
  },

  memberEntranceStatus: (data) => {
    socketIo.io.of(entrance).emit(memberEntrance, data)
  }


};
