import axios from 'axios';
import { GET_ERRORS } from './types';
import { logoutUser } from './authActions'

export const GET_PROFILES = 'GET_PROFILES';
export const PROFILE_NOT_FOUND = 'PROFILE_NOT_FOUND';


export const GET_PROFILE = 'GET_PROFILE';
export const getProfile = () => {
  return (dispatch) => {
    dispatch(profileLoading());
    axios.get('/api/profile')
      .then(response =>
        dispatch({
          type: GET_PROFILE,
          payload: response.data
        }))
      .catch(error =>
        dispatch({
          type: GET_PROFILE,
          // if there is no profile you have to create one
          payload: {}
        }))
  };
};

export const CREATE_PROFILE = 'CREATE_PROFILE';
export const createProfile = (profileData, history) => {
  return (dispatch) => {
    axios.post('/api/profile', profileData)
      .then((result) => {
        history.push('/dashboard');
      })
      .catch((error) => {
        dispatch({
          type: GET_ERRORS,
          payload: error.response.data
        })
      })
  }
}

export const deleteAccount = () => {
  return (dispatch) => {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
      axios.delete('/api/profile')
        .then((response) => {
          dispatch(logoutUser());
        })
        .catch((error) => {
          dispatch({
            type: GET_ERRORS,
            payload: error.response.data
          })
        })
    }
  }
}

export const PROFILE_LOADING = 'PROFILE_LOADING';
export const profileLoading = () => {
  return {
    type: PROFILE_LOADING
  }
}

export const CLEAR_CURRENT_PROFILE = 'CLEAR_CURRENT_PROFILE';
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  }
}