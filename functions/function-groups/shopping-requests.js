const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const { db }  = require('../db');

const app = express();
app.use(cors({ origin: true }));

app.post('/', async (req, res) => {
    const {communityId, userId, categoryId, productsList} = req.body;
    const result = await db.collection('shopping_requests').add({
        communityId: communityId,
        userId: userId,
        categoryId: categoryId,
        productsList: productsList,
        status: "pending"
    });
    res.json({ id: result.id });
});

exports.shopping_requests = functions.region('europe-west1').https.onRequest(app);