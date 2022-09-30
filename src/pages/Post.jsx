import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { MdOutlineBathroom } from 'react-icons/md';
import { IoBedOutline } from 'react-icons/io5';
import { IconContext } from 'react-icons/lib';
import { TbSofa, TbParking } from 'react-icons/tb';
import { BsShare } from 'react-icons/bs';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Scrollbar, A11y } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { locationIcon } from '../assets/images';
import { Loading } from '../components';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';

const Post = () => {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    fetchPost();
  }, [params.postId]);

  const fetchPost = async () => {
    const postRef = doc(db, 'listings', params.postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      setPost(postSnap.data());
      setIsLoading(false);
    }
  };

  console.log(auth.currentUser);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <IconContext.Provider value={{ color: 'rgb(14, 165, 233)', size: '30px' }}>
      <div className="p-5 h-full">
        {post === null ? (
          <Loading />
        ) : (
          <main className="grid grid-cols-2 h-max">
            <section>
              <Swiper
                modules={[Pagination, Navigation, Scrollbar, A11y]}
                slidesPerView={1}
                pagination={{ clickable: true }}>
                {post.imgUrls.map((img, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <img src={post.imgUrls[index]} className="w-full h-96 object-cover"></img>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </section>
            <div className="pl-5 text-gray-500 h-full">
              <section className="mb-5 bg-white p-5 rounded-lg flex flex-row justify-between items-center">
                <div>
                  <div className="flex flex-row items-center">
                    <img src={locationIcon} width="30" />
                    <p className="font-bold text-2xl text-sky-500 mb-2 capitalize">{post.location}</p>
                  </div>
                  <p className="font-semibold text-xl capitalize">{post.name}</p>
                  <p className="w-20 text-center font-thin border-2 text-white bg-gray-500 uppercase mt-4 shadow-lg rounded-md">
                    {post.type}
                  </p>
                </div>
                {!shareLinkCopied && (
                  <div
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setShareLinkCopied(true);
                      toast.success('Post copied');
                      setTimeout(() => {
                        setShareLinkCopied(false);
                      }, 2000);
                    }}
                    className="bg-gray-100 py-4 px-4 rounded-full cursor-pointer">
                    <BsShare />
                  </div>
                )}
              </section>
              <section className="mb-5 bg-white p-5 rounded-lg text-center font-extrabold text-4xl text-green-500">
                <p>
                  ${post.offer ? post.discountedPrice : post.regularPrice}
                  {(post.type === 'rent' || post.type === 'homestay') && '/Month'}
                </p>
              </section>
              <section className="mb-5 bg-white p-5 rounded-lg flex flex-row justify-evenly uppercase">
                <div className="flex flex-col items-center">
                  <p className="text-xl mb-2 font-thin">Latitude</p>
                  <p className="p-2 border-2 border-sky-500 rounded-lg w-40 text-center text-black text-lg font-bold shadow-xl uppercase">
                    {post.geolocation.latitude}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-xl mb-2 font-thin">Longitude</p>
                  <p className="p-2 border-2 border-sky-500 rounded-lg w-40 text-center text-black text-lg font-bold shadow-xl">
                    {post.geolocation.longitude}
                  </p>
                </div>
              </section>
              <section className="mb-5 bg-white p-5 rounded-lg">
                <p className="uppercase">Amenities</p>
                <section className="flex flex-row justify-evenly">
                  <div className="flex flex-row items-center space-x-2">
                    <IoBedOutline />
                    <p className="text-xl">{post.bedrooms ? post.bedrooms : '1'}</p>
                  </div>
                  <div className="flex flex-row items-center space-x-2">
                    <MdOutlineBathroom />
                    <p className="text-xl">{post.bathrooms ? post.bathrooms : '1'}</p>
                  </div>
                  <div className="flex flex-row items-center space-x-2">
                    <TbSofa />
                    <p className="text-xl">{post.furnished ? 'Yes' : 'No'}</p>
                  </div>
                  <div className="flex flex-row items-center space-x-2">
                    <TbParking />
                    <p className="text-xl">{post.parking ? 'Yes' : 'No'}</p>
                  </div>
                </section>
              </section>
              {auth.currentUser.uid !== post.userRef && (
                <section className="mb-5 bg-white p-5 rounded-lg text-center">
                  <Link
                    to={`/contact/${post.userRef}?postName=${post.name}`}
                    className="bg-indigo-400 py-2 px-20 text-xl uppercase font-semibold rounded-lg ring-2 text-gray-100 ring-sky-500 hover:-translate-y-1 transition duration-200">
                    Contact Owner
                  </Link>
                </section>
              )}
              <section className="w-full h-96">
                <MapContainer
                  style={{ width: '100%', height: '100%' }}
                  center={[post.geolocation.latitude, post.geolocation.longitude]}
                  zoom={13}
                  scrollWheelZoom={true}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[post.geolocation.latitude, post.geolocation.longitude]}>
                    <Popup>{post.location}</Popup>
                  </Marker>
                </MapContainer>
              </section>
            </div>
          </main>
        )}
      </div>
    </IconContext.Provider>
  );
};

export default Post;
