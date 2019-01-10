import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { loginUser } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errors: {}
    }
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    // check if user is authenticated
    if (nextProps.auth.isAuthenticated) {
      nextProps.history.push('/dashboard');
    }
    // if there is an error
    if (nextProps.errors) {
      // then add it to errors object
      return { errors: nextProps.errors };
    }
    return null;
  };

  // componentDidMount() {
  //   if(this.props.auth.isAuthenticated) {
  //     this.props.history.push('dashboard');
  //   }
  // }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors })
    }

  };

  onChange = (event) => {
    const target = event.target.value;
    this.setState({ [event.target.name]: target })
  };

  onSubmit = (event) => {
    event.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password,
    }
    this.props.onLonginUser(userData)
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <p className="lead text-center">Sign in to your DevConnector account</p>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <TextFieldGroup
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    error={errors.email} />
                </div>
                <div className="form-group">
                  <TextFieldGroup
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange}
                    error={errors.password} />
                </div>
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  onLonginUser: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
    errors: state.errors
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLonginUser: (user, error) => dispatch(loginUser(user, error))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);