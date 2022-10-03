import React from 'react';
import { useState, useEffect } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { connect } from 'react-redux/es/exports';
import PropTypes from 'prop-types';
import { TextField, Button, Fab } from '@mui/material';
import { Edit, Done, Logout } from '@mui/icons-material';

import { db } from '../firebase.config';
import { UserIcon } from '../assets/icons';
import { types } from '../actions/types';
import { queryListingData } from '../utils/asyncUtils';
import { Progress, PostList, InstructionModal } from '../components';
import styles from './styles';
import { Messages } from '../constants';

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
  const [showLogoutModal, toggleLogoutModal] = useState(false);
  const { name, email } = userData;

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
      toast.success(Messages.UPDATE_INFO_SUCCESS);
    } catch (error) {
      console.log(error);
      toast.error(Messages.UPDATE_INFO_FAIL);
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
    return <Progress />;
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <main className="auth-container flex flex-col items-center my-10">
        <h1 className="text-gray-500 font-semibold text-xl my-5">Personal Information</h1>
        <UserIcon fill="#42b0f5" width="40" height="40" />
        <TextField
          onChange={onChangeUserInput}
          type="text"
          id="name"
          value={name}
          disabled={!changeProfile}
          sx={styles.userInfo}
        />
        <TextField type="email" id="email" value={email} disabled={true} sx={styles.userInfo} />
        <div className="flex flex-row space-x-5 my-5">
          <Button
            type="button"
            onClick={() => {
              changeProfile && onUpdateUserInfo();
              setChangeProfile((prev) => !prev);
            }}>
            {changeProfile ? (
              <Fab color="primary">
                <Done />
              </Fab>
            ) : (
              <Fab color="secondary">
                <Edit />
              </Fab>
            )}
          </Button>
          <Button type="button" onClick={() => toggleLogoutModal(true)}>
            <Fab variant="secondary">
              <Logout />
            </Fab>
          </Button>
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
      <InstructionModal
        open={showLogoutModal}
        onClose={handleSignout}
        toggleModal={toggleLogoutModal}
        firstButtonLabel="cancel"
        secondButtonLabel="Logout"
        message={Messages.LOG_OUT}
      />
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
