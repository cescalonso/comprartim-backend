const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors')({origin: true});
const communityRepository = require('../repositories/community-repository');
const shoppingRequestsRepository = require('../repositories/shopping-requests-repository');

const app = express();
app.use(cors);

app.post('/', async (req, res) => {
    const {communityId, ownerId, categoryId, productsList} = req.body;
  
    if (!await communityRepository.exists(communityId)) {
      return res.status(400).send("Community does not exist");
    }

    const result = await shoppingRequestsRepository.create(communityId, ownerId, categoryId, productsList);
    
    return res.json({ id: result.id });
});

app.put('/:id/accept', async (req, res) => {
  const {buyerId} = req.body;
  const shoppingRequestId = req.params.id;

  if (!await shoppingRequestsRepository.isPending(shoppingRequestId)){
    return res.status(400).send("Shopping request does not exist or is not pending");
  }

  await shoppingRequestsRepository.accept(shoppingRequestId, buyerId).catch(err => {
    console.log(`Error accepting the shopping request ${shoppingRequestId}`, err);
    return res.status(500).send();
  });

  return res.status(200).send();
});

exports.shopping_requests = functions.region('europe-west1').https.onRequest(app);