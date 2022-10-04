import React from 'react';
import { useState, useEffect } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { connect } from 'react-redux/es/exports';
import PropTypes from 'prop-types';
import { TextField, Button, Fab, Avatar } from '@mui/material';
import { Edit, Done, Logout, FileUpload } from '@mui/icons-material';

import { db } from '../firebase.config';
import { UserIcon } from '../assets/icons';
import { types } from '../actions/types';
import { queryListingData, storeImages } from '../utils/asyncUtils';
import { Progress, PostList, InstructionModal, FileUploader } from '../components';
import styles from './styles';
import { Messages } from '../constants';

const Profile = ({ signOutUser, userCredentials, updateUserInfo }) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: userCredentials.displayName,
    email: userCredentials.email,
    profileImg: userCredentials.profileImg
    //TODO
    // name: auth.currentUser.displayName,
    // email: auth.currentUser.email
  });
  const [userPosts, setUserPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [changeProfile, setChangeProfile] = useState(false);
  const [showLogoutModal, toggleLogoutModal] = useState(false);
  const { name, email, profileImg } = userData;

  useEffect(() => {
    let userPosts = [];
    try {
      queryListingData('userRef', userCredentials.userId, userPosts);
    } catch (error) {
      toast.error('Could not fetch posts');
    }
    const timer = setTimeout(() => {
      setUserPosts(userPosts);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [auth.currentUser]);

  const handleSignout = () => {
    auth.signOut();
    signOutUser();
    localStorage.clear();
    navigate('/');
    toast.info(Messages.USER_SIGNOUT_SUCCESS);
  };

  const onUpdateUserInfo = async () => {
    try {
      const getProfileImage = await Promise.all([...profileImg].map((img) => storeImages(img, 'profileImg/', auth)));
      const profileImgUrl = getProfileImage.toString();
      auth.currentUser.displayName !== name &&
        (await updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: profileImgUrl
        }));
      const userRef = doc(db, 'users', userCredentials.userId);
      await updateDoc(userRef, {
        name: name,
        profileImg: profileImgUrl
      }).then(() => updateUserInfo({ displayName: name, email, uid: auth.currentUser.uid, profileImg: profileImgUrl }));
      toast.success(Messages.UPDATE_INFO_SUCCESS);
    } catch (error) {
      console.log(error);
      toast.error(Messages.UPDATE_INFO_FAIL);
    }
  };

  const onChangeUserInput = (e) => {
    if (e.target.files) {
      setUserData((prevState) => ({
        ...prevState,
        profileImg: e.target.files
      }));
    } else {
      setUserData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value
      }));
    }
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

  const getProfileAvatar = () => {
    if (userCredentials.profileImg) {
      return <img src={userCredentials.profileImg} alt="profile image" />;
    } else {
      return name[0];
    }
  };

  console.log('userCredentials:', auth.currentUser);
  console.log('user data:', userData);

  if (isLoading) {
    return <Progress />;
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <main className="auth-container flex flex-col items-center my-10">
        <Avatar sx={styles.userAvatar}>{getProfileAvatar()}</Avatar>
        <TextField
          onChange={onChangeUserInput}
          type="text"
          id="name"
          value={name}
          disabled={!changeProfile}
          sx={styles.userInfo}
        />
        <TextField type="email" id="email" value={email} disabled={true} sx={styles.userInfo} />
        <input type="file" onChange={onChangeUserInput} disabled={!changeProfile} />
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
    signOutUser: () => dispatch({ type: types.SIGN_OUT }),
    updateUserInfo: (payload) => dispatch({ type: types.UPDATE_USER_INFO_SUCCESS, payload })
  };
};

const mapStateToProps = (state) => {
  return {
    userCredentials: state.authReducer.userCredentials
  };
};

Profile.propTypes = {
  signOutUser: PropTypes.func.isRequired,
  userCredentials: PropTypes.object,
  updateUserInfo: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
