import React, { Fragment } from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, orderBy, where, limit } from 'firebase/firestore';
import { toast } from 'react-toastify';

import { db } from '../firebase.config';
import { Loading, ProductCard } from '../components';

const Offers = () => {
  const [listings, setListings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();

  const fetchListings = async () => {
    const listingsRef = collection(db, 'listings');
    try {
      const queryRef = query(listingsRef, where('offer', '==', true), orderBy('timestamp', 'desc'), limit(10));
      const querySnap = await getDocs(queryRef);
      const listings = [];
      querySnap.forEach((doc) => {
        listings.push({
          id: doc.id,
          data: doc.data()
        });
      });

      setListings(listings);
      setIsLoading(false);
    } catch (error) {
      toast.error('Could not get data');
    }
  };

  const emptyList = <h1>Currently, there is no offers</h1>;

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchListings();
    }, 2000);
    return () => clearTimeout(timer);
  }, [params.categoryName]);

  return (
    <div className="h-screen w-screen">
      <>
        {isLoading ? (
          <Loading />
        ) : listings && listings.length > 0 ? (
          <Fragment>
            <main>
              {listings.map((list) => {
                const {
                  bathrooms,
                  bedrooms,
                  discountedPrice,
                  furnished,
                  geolocation,
                  imgUrls,
                  location,
                  name,
                  offer,
                  parking,
                  regularPrice,
                  timestamp,
                  type
                } = list.data;
                return (
                  <section key={listings.id} className="grid lg:grid-cols-2 gap-2 mx-10 md:grid-cols-2 sm:grid-cols-1">
                    <ProductCard
                      offer={offer}
                      img={imgUrls}
                      name={name}
                      regularPrice={regularPrice}
                      bedrooms={bedrooms}
                      bathrooms={bathrooms}
                      location={location}
                      discountedPrice={offer ? discountedPrice : regularPrice}
                      type={type}
                    />
                  </section>
                );
              })}
            </main>
          </Fragment>
        ) : (
          emptyList
        )}
      </>
    </div>
  );
};

export default Offers;
