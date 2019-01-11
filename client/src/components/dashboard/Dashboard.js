import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getProfile } from '../../actions/profileActions'

class Dashboard extends Component {
  componentDidMount() {
    this.props.onGetProfile();
  }

  render() {
    return (
      <div>
        Dashboard
      </div>
    );
  }
}

Dashboard.propTypes = {
  onGetProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    errors: state.errors
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetProfile: () => dispatch(getProfile())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);