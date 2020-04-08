const { db }  = require('../db');


exports.exists = async (communityId) => {
    let communityReference = db.collection('communities').doc(communityId);
    let community = await communityReference.get();

    return community.exists;
}

exports.get = async (communityId) => {
    let communityReference = db.collection('communities').doc(communityId);
    return await communityReference.get();
}

exports.getAll = async () => {
    return await db.collection('communities').get();
}

exports.create = async (community_name) => {
    return await db.runTransaction(t => {
      return t.get(db.collection('communities_counter').doc('communities_counter_id'))
        .then(countersSnapshot => {
          const nextValue = countersSnapshot.data().value + 1;
          t.update(countersSnapshot.ref, { value: nextValue });
          
          const communityReference = db.collection('communities').doc(`${nextValue}`);
          t.create(communityReference, { name: community_name });
          return communityReference;
        });
    }).then(result => {
      console.log('Transaction success!');
      return result;
    })
  }