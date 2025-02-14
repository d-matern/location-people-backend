import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LocationDetectDto, LocationDto } from '../location/dto/location.dto';
import { LocationService } from '../location/location.service';
import * as dotenv from 'dotenv';

dotenv.config();

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN,
  },
})
export class LocationGateway {
  @WebSocketServer() io: Server;

  private activeUsers: Record<string, LocationDto> = {};

  constructor(private readonly locationService: LocationService) {}

  handleConnection(socket: Socket) {
    console.log(`A user connected: ${socket.id}`);
  }

  async handleDisconnect(socket: Socket) {
    console.log(`User disconnected: ${socket.id}`);

    if (this.activeUsers[socket.id]) {
      await this.locationService.updateUserStatus(
        this.activeUsers[socket.id].userId,
      );
      delete this.activeUsers[socket.id];
    }
    this.broadcastNearbyUsers();
  }

  @SubscribeMessage('updateLocation')
  async handleUpdateLocation(@MessageBody() data: LocationDetectDto, @ConnectedSocket() socket: Socket) {
    await this.locationService.updateUserLocation(data);
    this.activeUsers[socket.id] = data;
    this.broadcastNearbyUsers();
  }

  private async handleNearbyUsers(data: LocationDto) {
    const nearbyUsers = await this.locationService.getNearbyUsers(
      data.userId,
      data.radius,
    );
    return nearbyUsers;
  }

  private async broadcastNearbyUsers() {
    Object.keys(this.activeUsers).forEach(async (key) => {
      const users = await this.handleNearbyUsers(this.activeUsers[key]);
      this.io.to(key).emit('nearbyUsers', users);
    });
  }
}
