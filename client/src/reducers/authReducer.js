import { SET_CURRENT_USER } from '../actions/authActions'
import isEmpty from '../validation/is-empty';

const initialState = {
  isAuthenticated: false,
  user: {}
};


const authReducer = (state = initialState, action) => {
  switch (action.type) {
    // case REGISTER_USER:
    //   return {
    //     ...state,
    //     // fill the user with what is in payload
    //     user: action.payload
    //   };

    case SET_CURRENT_USER:
      return {
        ...state,
        // check to see if the object is not empty
        // because the payload is an obj with decoded user
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      }

    default:
      return state;
  }
};

export default authReducer;