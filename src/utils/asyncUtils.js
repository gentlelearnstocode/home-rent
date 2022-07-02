import { query, where, orderBy, limit, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';

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
