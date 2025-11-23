import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

// Initialize Socket.IO connection
export const initializeSocket = (token?: string): Socket => {
  if (socket?.connected) {
    return socket;
  }

  const socketUrl = import.meta.env.VITE_SOCKET_URL;

  socket = io(socketUrl, {
    auth: {
      token: token || localStorage.getItem('auth_token'),
    },
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling'],
  });

  // Connection event handlers
  socket.on('connect', () => {
    console.log('Socket.IO connected');
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket.IO disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket.IO connection error:', error);
  });

  socket.on('error', (error) => {
    console.error('Socket.IO error:', error);
  });

  return socket;
};

// Connect socket
export const connectSocket = () => {
  if (socket && !socket.connected) {
    socket.connect();
  }
};

// Disconnect socket
export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
};

// Get socket instance
export const getSocket = (): Socket | null => {
  return socket;
};

// Subscribe to order updates
export const subscribeToOrderUpdates = (
  orderId: string,
  callback: (data: any) => void
) => {
  if (!socket) return;

  socket.emit('subscribe:order', orderId);
  socket.on(`order:${orderId}:updated`, callback);
};

// Unsubscribe from order updates
export const unsubscribeFromOrderUpdates = (
  orderId: string,
  callback: (data: any) => void
) => {
  if (!socket) return;

  socket.emit('unsubscribe:order', orderId);
  socket.off(`order:${orderId}:updated`, callback);
};

// Subscribe to general notifications
export const subscribeToNotifications = (callback: (data: any) => void) => {
  if (!socket) return;

  socket.on('notification', callback);
};

// Unsubscribe from notifications
export const unsubscribeFromNotifications = (callback: (data: any) => void) => {
  if (!socket) return;

  socket.off('notification', callback);
};
