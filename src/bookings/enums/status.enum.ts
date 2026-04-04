// import { registerEnumType } from '@nestjs/graphql';

import { registerEnumType } from '@nestjs/graphql';

export enum BookingStatus {
  UNCONFIRMED = 'unconfirmed',
  CHECKED_IN = 'checked-in',
  CHECKED_OUT = 'checked-out',
}

registerEnumType(BookingStatus, {
  name: 'BookingStatus',
  description: 'Status of booking lifecycle',
});
