const functions = require('firebase-functions');
const { db }  = require('../db');

exports.counter = functions.region('europe-west1').https.onRequest(async (req, res) => {
    const writeResult = await db.collection('communities_counter').doc('communities_counter_id').create({ value: 0 });
    res.json({});
  });