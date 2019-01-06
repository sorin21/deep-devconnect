import { REGISTER_USER } from '../actions/authActions'


const initialState = {
  isAuthenticated: false,
  users: {}
};


const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_USER:
      return {
        ...state,
        // fill the user with what is in payload
        users: action.payload
      }
    default:
      return state;
  }
};

export default authReducer;