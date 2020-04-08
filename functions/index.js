const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));

const db = admin.firestore();
app.post('/', async (req, res) => {
      const name = req.body.name;
      let transaction = db.runTransaction(t => {
        return t.get(db.collection('communities_counter'))
          .then(countersSnapshot => {
            let nextValue;
            countersSnapshot.forEach(counter => {
              nextValue = counter.data().value + 1;
              t.update(counter.ref, {value: nextValue});
            });

            const communityReference = db.collection('communities').doc(`${nextValue}`);
            t.create(communityReference, {name: name});
            return communityReference;
          });
      }).then(result => {
        console.log('Transaction success!');
        return res.json({ id: result.id});
      }).catch(err => {
        console.log('Transaction failure:', err);
        return res.status(500).send();
      });
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

exports.counter = functions.region('europe-west1').https.onRequest(async (req, res) => {
  const writeResult = await admin.firestore().collection('communities_counter').add({value: 0});
  res.json({result: `Message with ID: ${writeResult.id} added.`});
});