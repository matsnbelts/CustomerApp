import * as firebase from 'firebase';
import firestore from 'firebase/firestore'

const settings = {timestampsInSnapshots: true};

const config = {
    apiKey: "AIzaSyBrLdQ4-fsDtmq5OcZAkZA30AaThdvIRyI",
    authDomain: "matsnbelts.firebaseapp.com",
    databaseURL: "https://matsnbelts.firebaseio.com",
    projectId: "matsnbelts",
    storageBucket: "matsnbelts.appspot.com",
    messagingSenderId: "618255723391",
    appId: "1:618255723391:web:47d33675f85b4cd3"
};
firebase.initializeApp(config);

// firebase.firestore().settings(settings);
// firebase.firestore().settings( { timestampsInSnapshots: true })

export default firebase;