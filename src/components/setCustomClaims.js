const admin = require('firebase-admin');

const serviceAccount = require('./path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://<your-database-name>.firebaseio.com'
});

const setCustomClaims = async () => {
  try {
    const user = await admin.auth().getUserByEmail('admin@gmail.com');
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log('Custom claims set for admin user');
  } catch (error) {
    console.error('Error setting custom claims:', error);
  }
};

setCustomClaims();
