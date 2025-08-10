export enum BookingStatus {
    Pending = "pending",
    Rejected = "rejected",
    Accepted = "accepted",
    Done = "done",
    NoShow = "no-show",
}

// UPDATED: Added clientEmail and clientPhone fields
export interface Booking {
    id?: string;
    clientName: string;
    clientPhone: string;
    service: string;
    barber: string;
    bookingDate: string;
    bookingTime: string;
    status: BookingStatus;
    createdAt: any;
}
