import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'
import classnames from 'classnames';

import { registerUser } from '../../actions/authActions'

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
    // if there is an error
    if (nextProps.errors) {
      // then add it to errors object
      return { errors: nextProps.errors };
    }
    return null;
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
                  <input
                    type="text"
                    className={classnames('form-control form-control-lg', {
                      'is-invalid': errors.name
                    })}
                    placeholder="Name"
                    name="name"
                    value={this.state.name}
                    onChange={this.onChange} />
                  {errors.name && (<div className="invalid-feedback">{errors.name}</div>)}
                </div>
                <div className="form-group">
                  <input type="email" className={classnames('form-control form-control-lg', {
                    'is-invalid': errors.email
                  })} placeholder="Email Address" name="email" value={this.state.email} onChange={this.onChange} />
                  {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                  <small className="form-text text-muted">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
                </div>
                <div className="form-group">
                  <input type="password" className={classnames('form-control form-control-lg', {
                    'is-invalid': errors.password
                  })} placeholder="Password" name="password" value={this.state.password} onChange={this.onChange} />
                  {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
                </div>
                <div className="form-group">
                  <input type="password" className={classnames('form-control form-control-lg', {
                    'is-invalid': errors.password2
                  })} placeholder="Confirm Password" name="password2" value={this.state.password2} onChange={this.onChange} />
                  {errors.password2 && (<div className="invalid-feedback">{errors.password2}</div>)}
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