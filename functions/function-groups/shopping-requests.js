const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors')({origin: true});
const community_repository = require('../repositories/community-repository');
const shopping_requests_repository = require('../repositories/shopping-requests-repository');

const app = express();
app.use(cors);

app.post('/', async (req, res) => {
    const {communityId, userId, categoryId, productsList} = req.body;
  
    if (!await community_repository.exists(communityId)) {
      return res.status(400).send("Community does not exist");
    }

    const result = await shopping_requests_repository.create(communityId, userId, categoryId, productsList);
    
    return res.json({ id: result.id });
});

exports.shopping_requests = functions.region('europe-west1').https.onRequest(app);