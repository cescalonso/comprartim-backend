const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const { db }  = require('../db');

const app = express();
app.use(cors({ origin: true }));

app.post('/', async (req, res) => {
  const name = req.body.name;
  let transaction = db.runTransaction(t => {
    return t.get(db.collection('communities_counter'))
      .then(countersSnapshot => {
        let nextValue;
        countersSnapshot.forEach(counter => {
          nextValue = counter.data().value + 1;
          t.update(counter.ref, { value: nextValue });
        });

        const communityReference = db.collection('communities').doc(`${nextValue}`);
        t.create(communityReference, { name: name });
        return communityReference;
      });
  }).then(result => {
    console.log('Transaction success!');
    return res.json({ id: result.id });
  }).catch(err => {
    console.log('Transaction failure:', err);
    return res.status(500).send();
  });
});

app.get('/', async (req, res) => {
  let result = await db.collection('communities').get();

  if (result.empty) {
    return res.json([]);
  }

  let communities = [];

  result.forEach(doc => {
    const community = {
      id: doc.id,
      name: doc.data().name
    }
    communities.push(community);
  });

  return res.json(communities);
});

app.get('/:id', async (req, res) => {
  let communityReference = db.collection('communities').doc(req.params.id);
  let community = await communityReference.get();

  if (!community.exists) {
    return res.status(404).send();
  }
  return res.json({
    id: community.id,
    name: community.data().name
  });
});

exports.communities = functions.region('europe-west1').https.onRequest(app);