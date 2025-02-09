import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { LocationDto } from '../location/dto/location.dto';
import { LocationService } from '../location/location.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class LocationGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly locationService: LocationService) {}

  @SubscribeMessage('updateLocation')
  async handleUpdateLocation(@MessageBody() data: LocationDto) {
    await this.locationService.updateUserLocation(data);
  }

  @SubscribeMessage('nearbyUsers')
  async handleNearbyUsers(@MessageBody() userId: number) {
    const nearbyUsers = await this.locationService.getNearbyUsers(userId);
    return nearbyUsers;
  }
}
