const { db } = require('../db');
const chatRoomsCollection = db.collection('ChatRooms');
const shoppingRequestCollection = db.collection('shopping_requests');
const usersChatCollection = db.collection("UsersChat");


exports.create = async (shoppingRequestId, buyerId) => {
    const shoppingRequest = await shoppingRequestCollection.doc(shoppingRequestId).get();
    const chatRoomRef = chatRoomsCollection.doc();

    const createdAt = Date.now();
    const members = [shoppingRequest.data().ownerId, buyerId];
    console.log(members);
    await chatRoomRef.set({
        title: 'Xat de sol·licitud de compra',
        members: members,
        createdAt,
        isRemoved: false,
        isOpen: true
    })

    await members.forEach(member => { addMemberstoChat(member, chatRoomRef.id); });

    return chatRoomRef.id;
}

async function addMemberstoChat(memberId, chatId) {
    const chatRef = usersChatCollection.doc(memberId);

    await chatRef.set({ [chatId]: chatId }).catch((err) => {
        if (err) {
            console.log(err);
        }
    });
}