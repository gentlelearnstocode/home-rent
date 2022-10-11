import { types } from '../actions/types';
const initialState = {
  userCredentials: {
    displayName: '',
    email: '',
    userId: '',
    profileImg: ''
  },
  isSignedIn: false,
  checkingStatus: true,
  isSigningIn: false,
  isSigningError: false
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SIGN_IN_INIT: {
      return {
        ...state,
        isSigningIn: true,
        isSigningError: false
      };
    }
    case types.SIGN_IN_SUCCESS: {
      const { displayName, email, uid, photoURL } = action.payload;
      return {
        ...state,
        userCredentials: { ...state.userCredentials, displayName, email, userId: uid, profileImg: photoURL },
        isSignedIn: true,
        checkingStatus: false,
        isSigningIn: false,
        isSigningError: false
      };
    }
    case types.SIGN_IN_FAIL: {
      return {
        ...state,
        isSigningIn: false,
        isSigningError: true
      };
    }
    case types.SIGN_OUT:
      return {
        ...initialState
      };
    case types.SIGN_UP_SUCCESS: {
      const { displayName, email, uid } = action.payload;
      return {
        ...state,
        userCredentials: { ...state.userCredentials, displayName, email, userId: uid },
        isSignedIn: true
      };
    }
    case types.UPDATE_USER_INFO_SUCCESS: {
      const { displayName, email, uid, profileImg } = action.payload;
      return {
        ...state,
        userCredentials: {
          ...state.userCredentials,
          displayName,
          userId: uid,
          profileImg
        },
        isSignedIn: true
      };
    }
    case types.UPDATE_USER_AVATAR_SUCCESS: {
      const { displayName, email, uid, profileImg } = action.payload;
      return {
        ...state,
        userCredentials: {
          ...state.userCredentials,
          profileImg,
          displayName,
          userId: uid
        }
      };
    }
    default:
      return state;
  }
};

export default authReducer;
