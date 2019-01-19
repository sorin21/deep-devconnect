import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getProfile, deleteAccount } from '../../actions/profileActions'
import Spinner from '../common/Spinner';
import ProfileActions from './ProfileActions'

class Dashboard extends Component {
  componentDidMount() {
    this.props.onGetProfile();
  }

  deleteMyAccount = (event) => {
    this.props.onDeleteAccount();
  }

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let dashboardContent;

    if (profile === null || loading) {
      dashboardContent = <Spinner />;
    } else {
      // Check if logged in user has profile data
      if (Object.keys(profile).length > 0) {
        // if the check is true means they have a profile, so display it
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome <Link to={`/profile/${profile.handle}`}>{user.name}</Link> </p>
            <ProfileActions />
            <div style={{ marginBottom: '60px' }}>
              <button className="btn btn-danger" onClick={this.deleteMyAccount}>Delete My Account</button>
            </div>
          </div>
        );
      } else {
        // User is logged in but has no profile
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome {user.name}</p>
            <p>You have not set up a profile, please add some info</p>
            <Link to="/create-profile" className="btn btn-lg btn-info">Create Profile</Link>
          </div>
        );
      }
    }

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboard</h1>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  onGetProfile: PropTypes.func.isRequired,
  onDeleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    profile: state.profile
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetProfile: () => dispatch(getProfile()),
    onDeleteAccount: () => dispatch(deleteAccount())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);