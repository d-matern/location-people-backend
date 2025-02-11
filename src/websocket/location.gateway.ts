import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { LocationDetectDto, LocationDto } from '../location/dto/location.dto';
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
