import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // We can restrict this in production
  },
  namespace: 'notifications',
})
@Injectable()
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        this.logger.warn(`Client ${client.id} connected without token`);
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token);
      const userId = payload.sub;

      if (!userId) {
        this.logger.warn(`Client ${client.id} token has no userId`);
        client.disconnect();
        return;
      }

      // Join user to a private room
      client.join(`user_${userId}`);
      this.logger.log(
        `Client ${client.id} (User: ${userId}) connected and joined room user_${userId}`,
      );
    } catch (error) {
      this.logger.error(
        `Connection failed for client ${client.id}: ${error.message}`,
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.id} disconnected`);
  }

  /**
   * Broadcast a notification to a specific user
   */
  sendNotificationToUser(userId: string, notification: any) {
    const room = `user_${userId}`;
    this.logger.log(`Emitting 'notification' to room: ${room}`);
    this.server.to(room).emit('notification', notification);
  }

  @SubscribeMessage('join_gym')
  handleJoinGym(
    @MessageBody() data: { gymId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `gym_${data.gymId}`;
    console.error(`[NotificationsGateway] Received join_gym request for room: ${room}`);
    client.join(room);
    this.logger.log(`Client ${client.id} joined gym room: ${room}`);
    return { event: 'joined_gym', data: room };
  }

  /**
   * Broadcast an event to a specific gym room
   */
  sendToGym(gymId: string, event: string, data: any) {
    const room = `gym_${gymId}`;
    console.error(`[NotificationsGateway] Sending '${event}' to room: ${room}. Data:`, data);
    this.logger.log(`Emitting '${event}' to room: ${room}`);
    this.server.to(room).emit(event, data);
  }
}
