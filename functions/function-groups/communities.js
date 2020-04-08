const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const community_repository = require('../repositories/community-repository');

const app = express();
app.use(cors({ origin: true }));

app.post('/', async (req, res) => {
  const community_name = req.body.name;

  let answer = await community_repository.create(community_name).catch(err => {
    console.log('Transaction failure:', err);
    return res.status(500).send();
  });

  return res.json({id: answer.id});
});

app.get('/', async (req, res) => {
  let communities_data = await community_repository.getAll();

  if (communities_data.empty) {
    return res.json([]);
  }

  let communities = [];

  communities_data.forEach(community_data => {
    const community = {
      id: community_data.id,
      name: community_data.data().name
    }
    communities.push(community);
  });

  return res.json(communities);
});

app.get('/:id', async (req, res) => {
  const community_id = req.params.id;
  const community = await community_repository.get(community_id);

  if (!community.exists) {
    return res.status(404).send();
  }

  return res.json({
    id: community.id,
    name: community.data().name
  });
});

exports.communities = functions.region('europe-west1').https.onRequest(app);
