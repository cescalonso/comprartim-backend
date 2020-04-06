const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Cloud Firestore.
const admin = require('firebase-admin');

exports.helloWorld = functions.region('europe-west1').https.onRequest((request, response) => {
 response.send("Hello World!");
});

admin.initializeApp();
// [END import]

// [START addMessage]
// Take the text parameter passed to this HTTP endpoint and insert it into 
// Cloud Firestore under the path /messages/:documentId/original
// [START addMessageTrigger]
exports.addMessage = functions.region('europe-west1').https.onRequest(async (req, res) => {
// [END addMessageTrigger]
  // Grab the text parameter.
  const original = req.query.text;
  // [START adminSdkAdd]
  // Push the new message into Cloud Firestore using the Firebase Admin SDK.
  const writeResult = await admin.firestore().collection('messages').add({original: original});
  // Send back a message that we've succesfully written the message
  res.json({result: `Message with ID: ${writeResult.id} added.`});
  // [END adminSdkAdd]
});
// [END addMessage]

// [START makeUppercase]
// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
// [START makeUppercaseTrigger]
exports.makeUppercase = functions.region('europe-west1').firestore.document('/messages/{documentId}').onCreate((snap, context) => {
// [END makeUppercaseTrigger]
      // [START makeUppercaseBody]
      // Grab the current value of what was written to the Cloud Firestore.
      const original = snap.data().original;
      console.log('Uppercasing', context.params.documentId, original);
      const uppercase = original.toUpperCase();
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Cloud Firestore.
      // Setting an 'uppercase' field in the Cloud Firestore document returns a Promise.
      return snap.ref.set({uppercase}, {merge: true});
      // [END makeUppercaseBody]
});
