import { io, Socket } from 'socket.io-client'

const URL = import.meta.env.NODE_ENV === 'production' ? undefined : import.meta.env.VITE_BASE_URL

let socket: Socket | null = null

const initializeSocket = (userEmail: string): Socket => {
  if (!socket) {
    socket = io(URL, {
      query: { userEmail }
    })
  }
  return socket
}

const getSocket = (): Socket | null => {
  return socket
}

export { initializeSocket, getSocket }
