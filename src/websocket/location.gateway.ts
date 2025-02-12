import {
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
  @WebSocketServer() server: Server;

  constructor(private readonly locationService: LocationService) {}

  handleConnection(client: Socket) {
    console.log(`A user connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`User disconnected: ${client.id}`);
  }

  @SubscribeMessage('updateLocation')
  async handleUpdateLocation(@MessageBody() data: LocationDetectDto) {
    await this.locationService.updateUserLocation(data);
  }

  @SubscribeMessage('nearbyUsers')
  async handleNearbyUsers(@MessageBody() data: LocationDto) {
    const nearbyUsers = await this.locationService.getNearbyUsers(
      data.userId,
      data.radius,
    );
    return nearbyUsers;
  }
}
