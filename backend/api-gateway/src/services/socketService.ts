import { Server as SocketIOServer } from 'socket.io';
import { logger } from '../utils/logger';

export function initializeSocketHandlers(io: SocketIOServer): void {
  io.on('connection', (socket) => {
    logger.info('Socket connected', { id: socket.id });

    socket.on('subscribe:event', (eventId: string) => {
      socket.join(`event:${eventId}`);
    });

    socket.on('unsubscribe:event', (eventId: string) => {
      socket.leave(`event:${eventId}`);
    });

    socket.on('disconnect', () => {
      logger.info('Socket disconnected', { id: socket.id });
    });
  });
}
