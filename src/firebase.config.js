import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAS6iCufYVcuDaATJ83tZeCVHTPbN1zFcU',
  authDomain: 'home-rent-741bf.firebaseapp.com',
  projectId: 'home-rent-741bf',
  storageBucket: 'home-rent-741bf.appspot.com',
  messagingSenderId: '528290471356',
  appId: '1:528290471356:web:c8711b0182191c2ba05fb9'
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
