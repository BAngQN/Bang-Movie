import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const app = initializeApp({
    credential: applicationDefault(),
});

export const adminAuth = getAuth(app);
