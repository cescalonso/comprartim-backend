const { db }  = require('../db');
const shoppingRequestCollection = db.collection('shopping_requests');


exports.create = async (communityId, ownerId, categoryId, productsList) => {
    return await shoppingRequestCollection.add({
        communityId: communityId,
        ownerId: ownerId,
        categoryId: categoryId,
        productsList: productsList,
        status: "pending"
    });
}

exports.getFrom = async (communityId) => {
    return await shoppingRequestCollection.where('communityId', '==', communityId).get();
}

exports.isPending = async (shoppingRequestId) => {
    let shoppingRequest = await shoppingRequestCollection.doc(shoppingRequestId).get();

    return shoppingRequest.exists && shoppingRequest.data().status === "pending";
}

exports.accept = async (shoppingRequestId, buyerId) => {
    return await shoppingRequestCollection.doc(shoppingRequestId).update({buyerId: buyerId, status: "accepted"})
}