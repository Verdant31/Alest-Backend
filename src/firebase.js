const firebase = require('firebase');


const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

firebase.initializeApp(firebaseConfig);

module.exports.SignUpWithEmailAndPassword = (email, password) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((user) => {
      return JSON.stringify(user);
    }).catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        return { err: 'The password is too weak' }
      } else {
        return { err: errorMessage }
      }
      return { err: error }
    })
}
module.exports.AddProduct = async (image, name, price) => {
  const productRef = firebase.database();
  await productRef.ref('products').push({
    name: name,
    price: price,
    image: image,
  })
}

module.exports.GetProducts = async () => {
  const dbRef = firebase.database();
  await dbRef.ref().child("products").get()
    .then((snapshot) => {
      if (snapshot.exists()) {
        return JSON.stringify(snapshot.val());
      } else {
        console.log("No data available")
      }
    }).catch(function (error) {
      console.log(error);
    })
}

module.exports.SignInWithEmailAndPassword = (email, password) => {

  return firebase.auth().signInWithEmailAndPassword(email, password)
    .then((user) => {
      return JSON.stringify(user);
    }).catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        return { err: 'The password is too weak' }
      } else {
        return { err: errorMessage }
      }
      return { err: error }
    })
}

return module.exports
