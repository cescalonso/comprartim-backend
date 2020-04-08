const { db }  = require('../db');


exports.create = async (communityId, userId, categoryId, productsList) => {
    return await db.collection('shopping_requests').add({
        communityId: communityId,
        userId: userId,
        categoryId: categoryId,
        productsList: productsList,
        status: "pending"
    });
}

exports.getFrom = async (communityId) => {
    return await db.collection('shopping_requests').where('communityId', '==', communityId).get();
}