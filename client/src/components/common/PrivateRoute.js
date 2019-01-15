import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const PrivateRoute = ({ component: Component, auth, ...rest }) => {
  return (
    // if the user is authenticated, load the Component, else redirect to login
    <Route {...rest} render={props => auth.isAuthenticated === true ? (<Component {...props} />) : (<Redirect to="/login" />)} />
  );
};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // onGetProfile: () => dispatch(getProfile())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);