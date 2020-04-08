const functions = require('firebase-functions');
const { db }  = require('../db');

exports.counter = functions.region('europe-west1').https.onRequest(async (req, res) => {
    const writeResult = await db.collection('communities_counter').add({ value: 0 });
    res.json({ result: `Message with ID: ${writeResult.id} added.` });
  });