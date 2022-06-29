import { types } from '../actions/types';
const initialState = {
  isSignedIn: false,
  checkingStatus: true
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SIGN_IN:
      return {
        ...state,
        isSignedIn: true,
        checkingStatus: false
      };
    case types.SIGN_OUT:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

export default authReducer;
