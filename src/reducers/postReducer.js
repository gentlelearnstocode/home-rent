import { types } from '../actions/types';

const initialState = {
  userPosts: [],
  isFetchingPost: false,
  isErrorFetching: false
};

export const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_USER_POST_INIT: {
      return {
        ...state,
        isFetchingPost: true,
        isErrorFetching: false
      };
    }
    case types.FETCH_USER_POST_SUCCESS: {
      const { userPosts } = action.payload;
      return {
        ...state,
        userPosts: userPosts,
        isFetchingPost: false,
        isErrorFetching: false
      };
    }
    case types.FETCH_USER_POST_FAIL: {
      return {
        ...state,
        isFetchingPost: false,
        isErrorFetching: true
      };
    }
    case types.DELETE_POST: {
      const { userPosts } = action.payload;
      return {
        ...state,
        userPosts
      };
    }
    default:
      return { ...state };
  }
};
