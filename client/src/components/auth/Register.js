import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { registerUser } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';


class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
      errors: {}
    }
  }

  // we mapp back to the state the props
  static getDerivedStateFromProps(nextProps, prevState) {
    // check if user is authenticated
    // if (nextProps.auth.isAuthenticated) {
    //   nextProps.history.push('/dashboard');
    // }
    // if there is an error
    if (nextProps.errors) {
      // then add it to errors object
      return { errors: nextProps.errors };
    }
    return null;
  };

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors })
    }
  };

  onChange = (event) => {
    // this event.target.name is name, or email, etc
    const target = event.target.value;
    this.setState({ [event.target.name]: target });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };
    // console.log(newUser)

    this.props.onRegisterUser(newUser, this.props.history);
    // console.log(this.props.users)
  };



  render() {
    const { errors } = this.state;

    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">Create your DevConnector account</p>
              <form onSubmit={this.onSubmit} noValidate>
                <div className="form-group">
                  <TextFieldGroup
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={this.state.name}
                    onChange={this.onChange}
                    error={errors.name} />
                </div>
                <div className="form-group">
                  <TextFieldGroup
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    error={errors.email}
                    info="This website uses Gravatar so if you want a profile image, use a Gravatar email" />
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
                <div className="form-group">
                  <TextFieldGroup
                    type="password"
                    placeholder="Confirm Password"
                    name="password2"
                    value={this.state.password2}
                    onChange={this.onChange}
                    error={errors.password2} />
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

Register.propTypes = {
  onRegisterUser: PropTypes.func.isRequired,
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
    onRegisterUser: (user, history) => dispatch(registerUser(user, history))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Register));