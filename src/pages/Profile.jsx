import React from 'react';
import { useState, useEffect } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { connect } from 'react-redux/es/exports';
import PropTypes from 'prop-types';
import { TextField, Button, Fab, Avatar, IconButton } from '@mui/material';
import { Edit, Done, Logout, CloudUpload } from '@mui/icons-material';

import { db } from '../firebase.config';
import { UserIcon } from '../assets/icons';
import { types } from '../actions/types';
import { storeImages } from '../utils/asyncUtils';
import { Progress, PostList, InstructionModal, FileUploader } from '../components';
import styles from './styles';
import { Messages } from '../constants';
import { getProfileAvatar } from '../utils/getterUtils';
import _ from 'lodash';

const Profile = ({ signOutUser, userCredentials, updateUserInfo, updateUserAvatar, userPosts, deleteUserPost }) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: userCredentials.displayName,
    email: userCredentials.email,
    profileImg: []
  });
  const [changeProfile, setChangeProfile] = useState(false);
  const [showLogoutModal, toggleLogoutModal] = useState(false);
  const { name, email, profileImg } = userData;
  const currentUser = auth.currentUser;

  const handleSignout = () => {
    auth.signOut();
    signOutUser();
    localStorage.clear();
    navigate('/');
    toast.info(Messages.USER_SIGNOUT_SUCCESS);
  };

  const onUpdateUserInfo = async () => {
    let profileImgUrl = [];
    const userRef = doc(db, 'users', userCredentials.userId);
    try {
      if (name === currentUser.displayName && _.isEmpty(profileImg)) {
        return toast.info(Messages.NOTHING_TO_UPDATE);
      }
      if (!_.isEmpty(profileImg)) {
        const getProfileImage = await Promise.all([...profileImg].map((img) => storeImages(img, 'profileImg/', auth)));
        profileImgUrl.push(getProfileImage);
        if (userCredentials.profileImg !== profileImgUrl) {
          await updateProfile(currentUser, {
            photoURL: profileImgUrl.toString()
          })
            .then(() => updateDoc(userRef, { profileImg: profileImgUrl.toString() }))
            .then(() =>
              updateUserAvatar({
                profileImg: profileImgUrl.toString(),
                displayName: userCredentials.displayName,
                uid: userCredentials.userId
              })
            );
        }
      }
      if (currentUser.displayName !== name) {
        await updateProfile(currentUser, {
          displayName: name
        })
          .then(() =>
            updateDoc(userRef, {
              name: name
            })
          )
          .then(() =>
            updateUserInfo({
              displayName: name,
              profileImg: userCredentials.profileImg,
              uid: userCredentials.userId
            })
          );
      }

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
    if (window.confirm(Messages.DELETE_POST_CONFIRM)) {
      await deleteDoc(doc(db, 'listings', id));
      const updatedList = userPosts.filter((post) => {
        return post.id !== id;
      });
      deleteUserPost({ userPosts: updatedList });
      toast.success(Messages.POST_DELETE_SUCCESS);
    }
  };

  const onViewPostItem = (type, id) => {
    navigate(`/category/${type}/${id}`);
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <main className="auth-container flex flex-col items-center my-10">
        <Avatar sx={styles.userAvatar}>{getProfileAvatar(userCredentials)}</Avatar>
        <TextField
          onChange={onChangeUserInput}
          type="text"
          id="name"
          value={name}
          disabled={!changeProfile}
          sx={styles.userInfo}
        />
        <TextField type="email" id="email" value={email} disabled={true} sx={styles.userInfo} />
        <div>
          <label htmlFor="avatar-input">Upload avatar</label>
          <input
            style={styles.userInfo}
            type="file"
            onChange={onChangeUserInput}
            disabled={!changeProfile}
            id="avatar-input"
          />
          {/* <FileUploader
            multiFile={false}
            disabled={!changeProfile}
            uploadTitle="Upload your avatar"
            onChangeUpload={(e) => onChangeUserInput(e)}
          /> */}
        </div>
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
    updateUserInfo: (payload) => dispatch({ type: types.UPDATE_USER_INFO_SUCCESS, payload }),
    updateUserAvatar: (payload) => dispatch({ type: types.UPDATE_USER_AVATAR_SUCCESS, payload }),
    deleteUserPost: (payload) => dispatch({ type: types.DELETE_POST, payload })
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
  updateUserInfo: PropTypes.func.isRequired,
  updateUserAvatar: PropTypes.func,
  userPosts: PropTypes.array,
  deleteUserPost: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
