import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { MdOutlineBathroom } from 'react-icons/md';
import { IoBedOutline } from 'react-icons/io5';
import { IconContext } from 'react-icons/lib';
import { TbSofa, TbParking } from 'react-icons/tb';

import { locationIcon } from '../assets/images';
import { Loading } from '../components';
import { db } from '../firebase.config';

const Post = () => {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    fetchPost();
  }, [params.postId]);

  const fetchPost = async () => {
    const postRef = doc(db, 'listings', params.postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      console.log(postSnap.data());
      setPost(postSnap.data());
      setIsLoading(false);
    }
  };

  return (
    <IconContext.Provider value={{ color: 'rgb(14, 165, 233)', size: '30px' }}>
      <div className="h-full w-full p-5">
        {post === null ? (
          <Loading />
        ) : (
          <main className="grid grid-cols-2">
            <div className="flex">
              <section>
                <img src={post.imgUrls[0]} className="w-100 h-100 object-contain"></img>
              </section>
              <section></section>
            </div>
            <div className="px-5 text-gray-500">
              <section className="mb-5 bg-white p-5 rounded-lg">
                <div className="flex flex-row items-center">
                  <img src={locationIcon} width="30" />
                  <p className="font-bold text-2xl text-sky-500 mb-2">{post.location}</p>
                </div>
                <p className="font-semibold text-xl">{post.name}</p>
              </section>
              <section className="mb-5 bg-white p-5 rounded-lg text-center font-extrabold text-4xl text-green-500">
                <p>
                  ${post.discountedPrice ? post.discountedPrice : post.regularPrice}
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
            </div>
          </main>
        )}
      </div>
    </IconContext.Provider>
  );
};

export default Post;
