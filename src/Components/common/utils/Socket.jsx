import { io } from "socket.io-client";

let socket = null;

// const SOCKET_URL = "http://10.5.51.101:8008";

//const SOCKET_URL ="https://api.tracklone.io";

export const initializeSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log(
        " Socket connected:",
        socket?.id
      );
    });

    socket.on("disconnect", (reason) => {
      console.log(
        " Socket disconnected:",
        reason
      );
    });

    socket.on("connect_error", (err) => {
      console.error(
        "Socket connection error:",
        err.message
      );
    });
  }

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};