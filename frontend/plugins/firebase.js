/* const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");
require("firebase/database");
require("dotenv").config();

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : "";

export const GoogleProvider = new firebase.auth.GoogleAuthProvider();
export const FacebookProvider = new firebase.auth.FacebookAuthProvider();
export const auth = firebase.auth();
export const db = firebase.database();
export default firebase;
 */
