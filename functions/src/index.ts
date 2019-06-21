import * as functions from 'firebase-functions';
// import { NativeStorage } from '@ionic-native/native-storage/ngx';
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});
