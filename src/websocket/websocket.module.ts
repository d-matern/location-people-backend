import { Module } from '@nestjs/common';
import { LocationModule } from 'src/location/location.module';
import { LocationGateway } from './location.gateway';

@Module({
  imports: [LocationModule],
  providers: [LocationGateway],
})
export class WebSocketModule {}
