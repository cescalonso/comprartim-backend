const { db, dbFieldValue }  = require('../db');
const shoppingRequestCollection = db.collection('shopping_requests');


exports.create = async (communityId, ownerId, categoryId, productsList) => {
    return await shoppingRequestCollection.add({
        communityId: communityId,
        ownerId: ownerId,
        categoryId: categoryId,
        productsList: productsList,
        status: "pending",
        createdAt: dbFieldValue.serverTimestamp()
    });
}

exports.getFrom = async (communityId) => {
    return await shoppingRequestCollection.where('communityId', '==', communityId).orderBy("createdAt", "desc").get();
}

exports.isPending = async (shoppingRequestId) => {
    let shoppingRequest = await shoppingRequestCollection.doc(shoppingRequestId).get();

    return shoppingRequest.exists && shoppingRequest.data().status === "pending";
}

exports.isOwnedBy = async (shoppingRequestId, ownerId) => {
    let shoppingRequest = await shoppingRequestCollection.doc(shoppingRequestId).get();

    return shoppingRequest.exists && shoppingRequest.data().ownerId === ownerId;
}

exports.isAccepted = async (shoppingRequestId) => {
    let shoppingRequest = await shoppingRequestCollection.doc(shoppingRequestId).get();

    return shoppingRequest.exists && shoppingRequest.data().status === "accepted";
}

exports.accept = async (shoppingRequestId, buyerId) => {
    return await shoppingRequestCollection.doc(shoppingRequestId).update({buyerId: buyerId, status: "accepted"})
}

exports.close = async (shoppingRequestId) => {
    return await shoppingRequestCollection.doc(shoppingRequestId).update({status: "closed"})
}