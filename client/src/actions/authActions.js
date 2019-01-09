import axios from 'axios';
import jwt_decode from 'jwt-decode';

import { GET_ERRORS } from './types';
import setAuthToken from '../utils/setAuthToken';


export const REGISTER_USER = 'REGISTER_USER';
export const registerUser = (userData, history) => {
  return (dispatch, getState) => {
    axios.post('/api/users/register', userData)
      .then(response => history.push('/login'))
      .catch(error =>
        dispatch({
          type: GET_ERRORS,
          payload: error.response.data
        })
      );
  };
};

export const LOGIN_USER = 'LOGIN_USER';
export const loginUser = (userData) => {
  return (dispatch) => {
    axios.post('/api/users/login', userData)
      .then(response => {
        // Save to local storage
        const { token } = response.data;
        // Set token to local storage
        localStorage.setItem('jwtToken', token);
        // Set token to auth header
        setAuthToken(token);
        // Decode token to get user data
        const decoded = jwt_decode(token);
        // Set current user
        dispatch(setCurrentUser(decoded));
      })
      .catch(error =>
        dispatch({
          type: GET_ERRORS,
          payload: error.response.data
        })
      );
  };

};

// Set logged user
export const SET_CURRENT_USER = 'SET_CURRENT_USER';
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Log user out
export const LOGOUT_USER = 'LOGOUT_USER';
export const logoutUser = () => {
  return (dispatch) => {
    // Remove the token from localStorage
    localStorage.removeItem('jwtToken');
    // Remove the auth header
    setAuthToken(false);
    // Set the current user to {}, witch will also set isAuthenticated to false
    dispatch(setCurrentUser({}));
  }
}