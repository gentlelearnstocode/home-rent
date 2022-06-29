import React, { useState, useRef, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { Loading, Modal } from '../components';
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { v4 } from 'uuid';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import { INCREASE_BATHROOMS, DECREASE_BATHROOMS, INCREASE_BEDROOMS, DECREASE_BEDROOMS } from '../constants';
import { GEOCODING_API_KEY, GEOCODING_API_URL } from '../config/apiConfig';
import { db } from '../firebase.config';
import axios from 'axios';
import { currentLocation } from '../assets/images';

const CreateListing = () => {
  const [isGeolocationEnabled, setGeolocationEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [isAddressModalOpen, toggleAddressModal] = useState(false);
  const [mapUrl, setMapUrl] = useState('');

  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0
  });
  const isMounted = useRef(true);
  const navigate = useNavigate();
  const auth = getAuth();

  const fetchGeolocation = async () => {
    let badRequest;
    const response = await axios(`${GEOCODING_API_URL}/address?key=${GEOCODING_API_KEY}&location=${address}`);
    response.data.results[0].locations[0].geocodeQualityCode === 'A1XXX' ? (badRequest = true) : (badRequest = false);
    if (badRequest) {
      setAddressError(true);
      toggleAddressModal(false);
    } else {
      const data = response.data.results[0].locations[0];
      setMapUrl(data.mapUrl);
      if (isGeolocationEnabled) {
        setFormData((formData) => ({
          ...formData,
          latitude: data.latLng.lat,
          longitude: data.latLng.lng
        }));
      }
      toggleAddressModal(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate('/sign-in');
        }
      });
    }
    return () => (isMounted.current = false);
  }, [isMounted]);

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    longitude,
    latitude,
    offer,
    regularPrice,
    discountedPrice,
    images
  } = formData;

  const handleUserInput = (e) => {
    e.preventDefault();
    let boolean = null;

    if (e.target.value === 'true') {
      boolean = true;
    } else if (e.target.value === 'false') {
      boolean = false;
    }

    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files
      }));
    }

    if (!e.target.files) {
      if (e.target.value === Number) {
        setFormData({
          ...formData,
          [e.target.id]: e.target.value
        });
      } else {
        setFormData({
          ...formData,
          [e.target.id]: boolean ?? e.target.value
        });
      }
    }
  };

  const storeImages = async (image) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage();
      const fileName = `${auth.currentUser.uid}-${image.name}-${v4()}`;
      const storageRef = ref(storage, 'images/' + fileName);
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

  const handleSubmitForm = async (e) => {
    console.log(formData);
    e.preventDefault();
    setIsLoading(true);
    if (discountedPrice >= regularPrice) {
      setIsLoading(false);
      toast.error('Discounted price needs to be less than regular price');
      return;
    }
    if (images.length > 6) {
      setIsLoading(false);
      toast.error('You cannot upload more than 6 images');
      return;
    }

    let geolocation = {};
    let location;
    if (isGeolocationEnabled) {
      fetchGeolocation();
      if (addressError) {
        toast.error('Cannot find longitude and latitude, please enter them manually');
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lat = latitude;
      location = address;
    }
  };

  const onChangeValue = (action) => {
    if (action === INCREASE_BEDROOMS) {
      setFormData((prevState) => ({
        ...prevState,
        bedrooms: bedrooms + 1
      }));
    } else if (action === DECREASE_BEDROOMS) {
      if (bedrooms > 1) {
        setFormData((prevState) => ({
          ...prevState,
          bedrooms: bedrooms - 1
        }));
      }
    } else if (action === INCREASE_BATHROOMS) {
      setFormData((prevState) => ({
        ...prevState,
        bathrooms: bathrooms + 1
      }));
    } else if (action === DECREASE_BATHROOMS) {
      if (bathrooms > 1) {
        setFormData((prevState) => ({
          ...prevState,
          bathrooms: bathrooms - 1
        }));
      }
    }
  };

  const handleToggleModal = () => {
    toggleAddressModal((prevState) => !prevState);
  };

  const onConfirmListing = async () => {
    const geolocation = { latitude, longitude };
    delete formData.latitude;
    delete formData.longitude;

    const imgUrls = await Promise.all(
      [...images].map((image) => {
        return storeImages(image);
      })
    ).catch(() => {
      setIsLoading(false);
      toast.error("Something went wrong. Couldn't upload images");
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls: imgUrls,
      timestamp: new Date(),
      geolocation
    };
    delete formDataCopy.address;
    delete formDataCopy.images;
    formDataCopy.location = address;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    const docRef = await addDoc(collection(db, 'listings'), formDataCopy);
    setIsLoading(false);
    toast.success('Post successfully saved');
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="flex justify-center h-full mt-15">
      <header></header>
      <main className="w-full flex justify-center ">
        <div className="w-1/3">
          <img src={currentLocation} />
        </div>
        <div className="w-1/2 bg-white px-5 py-2 shadow-2xl ring-2 ring-sky-400 my-5">
          {isAddressModalOpen && (
            <Modal
              toggleModal={handleToggleModal}
              mapUrl={mapUrl}
              inputAddress={address}
              longitude={longitude}
              latitude={latitude}
              onModalConfirm={onConfirmListing}
            />
          )}
          <form onSubmit={handleSubmitForm} className="flex flex-col">
            <label className="label-text">Type</label>
            <div className="flex flex-row space-x-2">
              <button
                onClick={handleUserInput}
                className={type === 'rent' ? 'create-list-active' : 'create-list'}
                id="type"
                value="rent">
                Rent
              </button>
              <button
                onClick={handleUserInput}
                className={type === 'sale' ? 'create-list-active' : 'create-list'}
                id="type"
                value="sale">
                Sell
              </button>
              <button
                onClick={handleUserInput}
                className={type === 'homestay' ? 'create-list-active' : 'create-list'}
                id="type"
                value="homestay">
                Homestay
              </button>
            </div>
            <label className="label-text">Title</label>
            <input
              onChange={handleUserInput}
              id="name"
              value={name}
              type="text"
              minLength="10"
              maxLength="30"
              className=" outline-none text-thin w-full py-1 text-gray-600 text-lg font-thin px-2 border-b-2 border-sky-400"
              required
            />
            <label className="label-text">Bedrooms</label>
            <div className="flex flex-row items-center space-x-2 text-2xl font-thin">
              <p className="w-10 py-2 bg-yellow-500 rounded-lg text-center text-white">{bedrooms}</p>
              <FaPlusCircle onClick={() => onChangeValue(INCREASE_BEDROOMS)} />
              <FaMinusCircle onClick={() => onChangeValue(DECREASE_BEDROOMS)} />
            </div>
            <label className="label-text">Bathrooms</label>
            <div className="flex flex-row items-center space-x-2 text-2xl font-thin">
              <p className="w-10 py-2 bg-yellow-500 rounded-lg text-center text-white">{bathrooms}</p>
              <FaPlusCircle onClick={() => onChangeValue(INCREASE_BATHROOMS)} />
              <FaMinusCircle onClick={() => onChangeValue(DECREASE_BATHROOMS)} />
            </div>
            <label className="label-text">Parking Spot</label>
            <div className="flex flex-row space-x-2">
              <button
                onClick={handleUserInput}
                id="parking"
                type="button"
                value={true}
                className={parking ? 'create-list-active' : 'create-list'}>
                Yes
              </button>
              <button
                onClick={handleUserInput}
                id="parking"
                type="button"
                value={false}
                className={!parking && parking !== null ? 'create-list-active' : 'create-list'}>
                No
              </button>
            </div>
            <label className="label-text">Furnished</label>
            <div className="flex flex-row space-x-2">
              <button
                onClick={handleUserInput}
                id="furnished"
                type="button"
                value={true}
                className={furnished ? 'create-list-active' : 'create-list'}>
                Yes
              </button>
              <button
                onClick={handleUserInput}
                id="furnished"
                type="button"
                value={false}
                className={!furnished && furnished !== null ? 'create-list-active' : 'create-list'}>
                No
              </button>
            </div>
            <div className="flex flex-col">
              <label className="label-text">Address</label>
              <textarea
                className="bg-slate-100 outline-none font-thin text-gray-600 border-b-2 border-sky-400"
                onChange={handleUserInput}
                id="address"
                value={address}
                type="text"
                required></textarea>
            </div>
            {!isGeolocationEnabled && (
              <div className="flex flex-row space-x-2">
                <div className="flex flex-col">
                  <label className="label-text">Latitude</label>
                  <input
                    onChange={handleUserInput}
                    className="text-center w-1/2 bg-slate-100 rounded-lg outline-none"
                    id="latitude"
                    value={latitude}
                    type="number"></input>
                </div>
                <div className="flex flex-col">
                  <label className="label-text">Longitude</label>
                  <input
                    onChange={handleUserInput}
                    className="text-center w-1/2 bg-slate-100 rounded-lg outline-none"
                    id="longitude"
                    value={longitude}
                    type="number"></input>
                </div>
              </div>
            )}
            <label className="label-text">Offer</label>
            <div className="flex flex-row space-x-2">
              <button
                onClick={handleUserInput}
                id="offer"
                type="button"
                value={true}
                className={offer ? 'create-list-active' : 'create-list'}>
                Yes
              </button>
              <button
                onClick={handleUserInput}
                id="offer"
                type="button"
                value={false}
                className={!offer && offer !== null ? 'create-list-active' : 'create-list'}>
                No
              </button>
            </div>
            {(type === 'rent' || type === 'homestay') && (
              <div className="flex flex-col">
                <label className="label-text">Regular Price</label>
                <section className="flex flex-row items-center">
                  <input
                    onChange={handleUserInput}
                    className="text-center w-1/4 py-4 bg-slate-100 rounded-lg outline-none text-xl font-semibold text-emerald-400"
                    id="regularPrice"
                    value={regularPrice}
                    type="number"></input>
                  <p className="label-text">/Month</p>
                </section>
              </div>
            )}
            {offer && (
              <div className="flex flex-col">
                <label className="label-text">Discounted Price</label>
                <section className="flex flex-row items-center">
                  <input
                    onChange={handleUserInput}
                    className="text-center w-1/4 py-4 bg-slate-100 rounded-lg outline-none text-xl font-semibold text-emerald-400"
                    id="discountedPrice"
                    value={discountedPrice}
                    type="number"></input>
                  <p className="label-text">/Month</p>
                </section>
              </div>
            )}
            <div className="flex flex-col">
              <label className="label-text">Images</label>
              <section className="w-full bg-slate-100 py-5 rounded-lg">
                <input
                  onChange={handleUserInput}
                  type="file"
                  max="6"
                  id="images"
                  accept=".png,.jpeg,.jpg"
                  multiple
                  required></input>
              </section>
            </div>
            <button type="submit" className="create-list-active my-5 capitalize hover:bg-emerald-300">
              submit post
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateListing;
