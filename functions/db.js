const admin = require('firebase-admin');

admin.initializeApp();

exports.db = admin.firestore();
exports.dbFieldValue = admin.firestore.FieldValue;