import { query, where, orderBy, limit, collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase.config';
import { v4 } from 'uuid';

export const queryListingData = async (type, param, listings) => {
  const listingsRef = collection(db, 'listings');
  const queryRef = query(listingsRef, where(type, '==', param), orderBy('timestamp', 'desc'), limit(10));
  const querySnap = await getDocs(queryRef);
  return querySnap.forEach((doc) => {
    listings.push({
      id: doc.id,
      data: doc.data()
    });
  });
};

export const storeImages = async (image, folder = 'images/', auth) => {
  return new Promise((resolve, reject) => {
    const storage = getStorage();
    const fileName = `${auth.currentUser.uid}-${image.name}-${v4()}`;
    const storageRef = ref(storage, folder + fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};
