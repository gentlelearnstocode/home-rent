import * as React from 'react';
import { Button, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { types } from '../actions/types';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';

import { Progress, ErrorModal, InstructionModal } from '../components';
import { queryListingDataV2 } from '../utils/asyncUtils';
import { Messages } from '../constants';
import { db } from '../firebase.config';

const ViewPosts = ({
  userPosts,
  userCredentials,
  fetchUserInit,
  fetchUserSuccess,
  fetchUserFail,
  isFetchingPost,
  isErrorFetching,
  deletePost
}) => {
  const [openErrorModal, setOpenErrorModal] = useState(isErrorFetching);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserPosts = async () => {
      fetchUserInit();
      try {
        const response = await queryListingDataV2('userRef', userCredentials.userId);
        if (response) {
          fetchUserSuccess({ userPosts: response });
        }
      } catch (error) {
        fetchUserFail();
      }
    };
    fetchUserPosts();
  }, []);

  const onDeletePost = async (id) => {
    console.log('id inside delete function:', id);
    await deleteDoc(doc(db, 'listings', id));
    const updatedList = userPosts.filter((post) => {
      return post.id !== id;
    });
    deletePost({ userPosts: updatedList });
    toast.success(Messages.POST_DELETE_SUCCESS);
  };

  const onViewPostItem = (type, id) => {
    navigate(`/category/${type}/${id}`);
  };

  const columns = [
    { field: 'id', headerName: 'Post Number', width: 90 },
    {
      field: 'postName',
      headerName: 'Name',
      width: 200,
      editable: true
    },
    {
      field: 'postImg',
      headerName: 'Image',
      width: 200,
      editable: true,
      renderCell: (param) => <img src={param.value} alt="img-description" />
    },
    {
      field: 'postPrice',
      headerName: 'Price',
      type: 'number',
      width: 200,
      editable: true
    },
    {
      field: 'address',
      headerName: 'Address',
      width: 200,
      editable: true
    },
    {
      field: 'metadata',
      headerName: 'Actions',
      width: 400,
      renderCell: (param) => {
        const { type, postId } = param.value;
        return (
          <div className="flex space-x-5">
            <Button onClick={() => onViewPostItem(type, postId)} variant="contained">
              View
            </Button>
            <Button
              onClick={() => {
                setOpenDeleteModal(true), setCurrentPostId(postId);
              }}
              color="error"
              variant="contained">
              Delete
            </Button>
            <Button color="success" variant="contained">
              Update
            </Button>
          </div>
        );
      }
    }
  ];

  const getRowsData = () => {
    let postsData = [];
    userPosts?.forEach((post, index) => {
      const { data } = post;
      let formattedData = {};
      formattedData.id = index + 1;
      formattedData.postName = data.name;
      formattedData.postImg = data.imgUrls[0];
      formattedData.postPrice = data.regularPrice || data.discoutedPrice;
      formattedData.address = data.location;
      formattedData.metadata = { postId: post.id, type: data.type };
      postsData.push(formattedData);
    });
    return postsData;
  };

  if (isFetchingPost) {
    return <Progress />;
  }

  console.log('userposts', userPosts);
  console.log('userdata:', userCredentials.userId);

  return (
    <>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={getRowsData()}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
      <ErrorModal
        open={openErrorModal}
        message={Messages.ERROR_FETCHING_POST}
        errorButtonLabel="Got it"
        toggleModal={setOpenErrorModal}
      />
      <InstructionModal
        open={openDeleteModal}
        message={Messages.DELETE_POST_CONFIRM}
        firstButtonLabel="Cancel"
        secondButtonLabel="Confirm"
        toggleModal={setOpenDeleteModal}
        id={currentPostId}
        onClose={onDeletePost}
      />
    </>
  );
};

ViewPosts.propTypes = {
  userPosts: PropTypes.array,
  userCredentials: PropTypes.object,
  fetchUserInit: PropTypes.func,
  fetchUserSuccess: PropTypes.func,
  fetchUserFail: PropTypes.func,
  isFetchingPost: PropTypes.bool,
  isErrorFetching: PropTypes.bool,
  deletePost: PropTypes.func
};

const mapStateToProps = (state) => {
  return {
    userPosts: state.postReducer.userPosts,
    userCredentials: state.authReducer.userCredentials,
    isFetchingPost: state.postReducer.isFetchingPost,
    isErrorFetching: state.postReducer.isErrorFetching
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserInit: () => dispatch({ type: types.FETCH_USER_POST_INIT }),
    fetchUserSuccess: (payload) => dispatch({ type: types.FETCH_USER_POST_SUCCESS, payload }),
    fetchUserFail: () => dispatch({ type: types.FETCH_USER_POST_FAIL }),
    deletePost: (payload) => dispatch({ type: types.DELETE_POST, payload })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewPosts);
