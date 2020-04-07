const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));

app.post('/', async (req, res) => {
      const name = req.body.name;

      const writeResult = await admin.firestore().collection('communities').add({name: name});
      res.json({result: `Message with ID: ${writeResult.id} added.`});
});

app.get('/',  async (req, res) => {
  let result =  await admin.firestore().collection('communities').get();

  if (result.empty) {
    res.json([]);
    return;
  }

  let communities = [];

  result.forEach(doc => {
    const community = {
      id: doc.id,
      name: doc.data().name
    }
    communities.push(community);
  });

  res.json(communities);
});


exports.communities = functions.region('europe-west1').https.onRequest(app);