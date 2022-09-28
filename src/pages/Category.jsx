import React, { Fragment } from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { ProductCard, Progress } from '../components';
import { queryListingData } from '../utils/asyncUtils';

const Category = () => {
  const [listings, setListings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    let listings = [];
    try {
      queryListingData('type', params.categoryName, listings);
    } catch (error) {
      toast.success('Something went wrong');
    }
    const timer = setTimeout(() => {
      setListings(listings);
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const emptyList = (
    <h1 className="font-semibold text-center">Currently, there is no places for {params.categoryName}</h1>
  );

  return (
    <>
      <div className="h-full">
        <header className="text-center font-semibold my-5 capitalize text-sky-500 text-2xl">
          Showing places for {params.categoryName}
        </header>
        {isLoading ? (
          <Progress />
        ) : listings && listings.length > 0 ? (
          <Fragment>
            <main className="grid lg:grid-cols-2 gap-2 mx-10 md:grid-cols-2 sm:grid-cols-1 my-10">
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
                const { id } = list;
                return (
                  <section key={listings.id}>
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
                      id={id}
                    />
                  </section>
                );
              })}
            </main>
          </Fragment>
        ) : (
          emptyList
        )}
      </div>
    </>
  );
};

export default Category;
