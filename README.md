# Client Dashboard via Firebase
## [Visit Site](https://not-next-nu.vercel.app/)

Show bookings loaded from Firebase projects via credentials.

Initialisation of main app with the following environment variables:
```
# .env

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

FIREBASE_SERVICE_ACCOUNT_KEY=
```

## Prerequisites
### Firebase Project
1. Must be initialised with Firestore Cloud Database
2. Authentication of proprietor must be enabled via Sign In first.
3. Proprietor must provide his/her own Firebase Config

```
const firebaseConfig = {
  apiKey:,               // <API_KEY>
  authDomain:,           // <AUTH_DOMAIN>
  projectId:,            // <PROJECT_ID>
  storageBucket:,        // <STORAGE_BUCKET>
  messagingSenderId:,    // <MESSAGING_SENDER_ID>
  appId:,                // <APP_ID>
};
```

### Current Booking Schema

Displaying of the data has been optimised following the schema below, however, a different configuration is possible on individual projects.

```
barber:         (string)
bookingDate:    (string)
bookingTime:    (string)
clientName:     (string)
clientPhone:    (string)
createdAt:      (timestamp)
service:        (string)
status:         (string)
```