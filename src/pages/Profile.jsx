import React from 'react';
import { useState, useEffect } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { connect } from 'react-redux/es/exports';
import PropTypes from 'prop-types';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { db } from '../firebase.config';
import { UserIcon } from '../assets/icons';
import { types } from '../actions/types';
import { queryListingData } from '../utils/asyncUtils';
import { Loading, PostList } from '../components';

const Profile = ({ signOutUser }) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: localStorage.getItem('displayName'),
    email: localStorage.getItem('Email')

    // name: auth.currentUser.displayName,
    // email: auth.currentUser.email
  });
  const [userPosts, setUserPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [changeProfile, setChangeProfile] = useState(false);
  const { name, email } = userData;

  console.log(localStorage.displayName);

  useEffect(() => {
    let userPosts = [];
    try {
      queryListingData('userRef', auth.currentUser.uid, userPosts);
    } catch (error) {
      toast.error('Could not fetch posts');
    }
    const timer = setTimeout(() => {
      setUserPosts(userPosts);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSignout = () => {
    auth.signOut();
    signOutUser();
    localStorage.clear();
    navigate('/');
    toast.info('You have been signed out ');
  };

  const onUpdateUserInfo = async () => {
    try {
      auth.currentUser.displayName !== name &&
        (await updateProfile(auth.currentUser, {
          displayName: name
        }));

      const user = auth.currentUser;
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        name: name
      });
      toast.success('Your information has been updated');
    } catch (error) {
      console.log(error);
      toast.error('Could not update personal information. Please try again.');
    }
  };

  const onChangeUserInput = (e) => {
    setUserData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }));
  };

  const onDeletePost = async (id) => {
    if (window.confirm('Delete this post?')) {
      await deleteDoc(doc(db, 'listings', id));
      const updatedList = userPosts.filter((post) => {
        return post.id !== id;
      });
      setUserPosts(updatedList);
      toast.success('Post has been successfully deleted');
    }
  };

  const onViewPostItem = (type, id) => {
    navigate(`/category/${type}/${id}`);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <header></header>
      <main className="auth-container flex flex-col items-center my-10">
        <h1 className="text-gray-500 font-semibold text-xl my-5">Personal Information</h1>
        <UserIcon fill="#42b0f5" width="40" height="40" />
        <input
          onChange={onChangeUserInput}
          type="text"
          id="name"
          value={name}
          disabled={!changeProfile}
          className="input-container border-2 rounded-lg"
        />
        <input type="email" id="email" value={email} disabled={true} className="input-container border-2 rounded-lg" />
        <div className="flex flex-row space-x-5 my-5">
          <button
            type="button"
            onClick={() => {
              changeProfile && onUpdateUserInfo();
              setChangeProfile((prev) => !prev);
            }}
            className="bg-green-500 w-20 py-1 text-md text-white font-semibold rounded-lg shadow-sm hover:bg-green-400">
            {changeProfile ? 'Done' : 'Update'}
          </button>
          <button
            type="button"
            onClick={handleSignout}
            className="bg-red-500 w-20 py-1 text-md text-white font-semibold rounded-lg shadow-sm hover:bg-red-400">
            Sign out
          </button>
        </div>
      </main>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mb-10">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Index
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Location
              </th>
              <th scope="col" className="px-6 py-3">
                Type
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3  text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {userPosts.map((post, index) => {
              const { name, location, regularPrice, discountedPrice, offer, type } = post.data;
              const { id } = post;
              return (
                <PostList
                  key={index}
                  title={name}
                  location={location}
                  price={offer ? discountedPrice : regularPrice}
                  type={type}
                  index={index}
                  id={id}
                  onDeletePost={onDeletePost}
                  onViewPostItem={onViewPostItem}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    signOutUser: () => dispatch({ type: types.SIGN_OUT })
  };
};

Profile.propTypes = {
  signOutUser: PropTypes.func.isRequired
};

export default connect(null, mapDispatchToProps)(Profile);
