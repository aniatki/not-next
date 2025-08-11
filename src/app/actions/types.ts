import { FieldValue, Timestamp } from "firebase/firestore";

export enum BookingStatus {
    Pending = "pending",
    Rejected = "rejected",
    Accepted = "accepted",
    Done = "done",
    NoShow = "no-show",
}

export interface Booking {
    id?: string;
    clientName: string;
    clientPhone: string;
    service: string;
    barber: string;
    bookingDate: string;
    bookingTime: string;
    status: BookingStatus;
    createdAt: Timestamp;
}

export type NewBooking = {
  clientName: string;
  clientPhone: string;
  service: string;
  barber: string;
  bookingTime: Timestamp;
  status: BookingStatus;
  createdAt: FieldValue;
};
