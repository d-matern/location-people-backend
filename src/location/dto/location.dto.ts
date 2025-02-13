export class LocationDto {
  userId: number;
  radius: number;
}

export class LocationDetectDto extends LocationDto {
  lat: number;
  lng: number;
  socketId: string;
}
