import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";
import path from "path";

let serviceAccount: string;

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
} else if (process.env.FIREBASE_ADMIN_SDK_SERVICE_ACCOUNT_KEY_PATH) {
    const absolutePath = path.join(
        process.cwd(),
        process.env.FIREBASE_ADMIN_SDK_SERVICE_ACCOUNT_KEY_PATH,
    );
    const rawKey = fs.readFileSync(absolutePath, "utf8");
    serviceAccount = JSON.parse(rawKey);
} else {
    throw new Error(
        "Firebase Admin SDK service account key is not set. Please set the FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_ADMIN_SDK_SERVICE_ACCOUNT_KEY_PATH environment variable.",
    );
}

const app =
    getApps().length === 0
        ? initializeApp({
              credential: cert(serviceAccount),
          })
        : getApps()[0];

export const adminAuth = getAuth(app);
