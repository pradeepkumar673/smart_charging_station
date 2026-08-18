// sockets/index.js
// Minimal Socket.io setup — expand with namespaces/events as features
// like live queue updates and bay status are built out.

function initSocket(io) {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}

module.exports = initSocket;
