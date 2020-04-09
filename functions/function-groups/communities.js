const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors')({origin: true});
const communityRepository = require('../repositories/community-repository');
const shoppingRequestRepository = require('../repositories/shopping-requests-repository');

const app = express();
app.use(cors);

app.post('/', async (req, res) => {
  const community_name = req.body.name;

  let answer = await communityRepository.create(community_name).catch(err => {
    console.log('Transaction failure:', err);
    return res.status(500).send();
  });

  return res.json({id: answer.id});
});

app.get('/', async (req, res) => {
  let communities_data = await communityRepository.getAll();

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
  const communityId = req.params.id;
  const community = await communityRepository.get(communityId);

  if (!community.exists) {
    return res.status(404).send();
  }

  return res.json({
    id: community.id,
    name: community.data().name
  });
});

app.get('/:id/shopping_requests', async (req, res) => {
  const communityId = req.params.id;

  if (!await communityRepository.exists(communityId)) {
    return res.status(400).send('Community does not exist');
  }

  const shoppingRequestsSnapshot = await shoppingRequestRepository.getFrom(communityId);

  const shoppingRequests = []

  shoppingRequestsSnapshot.forEach(shoppingRequestSnapshot => {
    let shoppingRequest = {
      id: shoppingRequestSnapshot.id
    };
    Object.assign(shoppingRequest, shoppingRequestSnapshot.data());
    shoppingRequests.push(shoppingRequest);
  });

  return res.json(shoppingRequests);
});

exports.communities = functions.region('europe-west1').https.onRequest(app);
