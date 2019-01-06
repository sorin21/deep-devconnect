import axios from 'axios'

import { GET_ERRORS } from './types';


export const REGISTER_USER = 'REGISTER_USER';
export const registerUser = (userData, history) => {
  console.log('history', history)
  return (dispatch, getState) => {
    axios.post('/api/users/register', userData)
      .then(response => history.push('/login'))
      .catch(error =>
        dispatch({
          type: GET_ERRORS,
          payload: error.response.data
        })
      );
  }
}