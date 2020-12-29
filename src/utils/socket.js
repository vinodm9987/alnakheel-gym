import socketIO from 'socket.io-client';
import { SOCKETIP } from '../config';
import { Observable } from 'rxjs';

export const socketConnect = (namespace, query) => {
    const io = socketIO(`${SOCKETIP}/${namespace}`, { query });
    return io;
};

export const emit = (event, data, io) => {
    io.emit(event, data);
};

export const listen = (event, io) => {
    const observable = new Observable(observer => {
        io.on(event, data => {
            observer.next(data);
        });
    })
    return observable
};