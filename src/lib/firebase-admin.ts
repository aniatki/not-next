import { initializeApp, getApps, getApp, App } from 'firebase-admin/app';
import { credential } from "firebase-admin"
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY ?
  JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf8'))
  : null;

let adminApp: App;

if (!getApps().length) {
  adminApp = initializeApp({
    credential: credential.cert(serviceAccount)
  });
} else {
  adminApp = getApp();
}

export function getAdminAuth() {
  return getAuth(adminApp);
}

export function getAdminApp() {
  return adminApp;
}