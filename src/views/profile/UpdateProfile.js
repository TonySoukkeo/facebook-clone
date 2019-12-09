import React, { Component } from "react";
import SecondaryNavigation from "../navigation/SecondaryNavigation";
import { updateUserProfile } from "../../controllers/user";
import TextInput from "../../common/form/TextInput";
import { error as inputError } from "../../controllers/error-handling";
import Loading from "../../common/helpers/Loading";
import { connect } from "react-redux";

class UpdateProfile extends Component {
  state = {
    work: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  };

  componentDidMount() {
    const { currentUser } = this.props;

    if (currentUser) {
      this.setState({
        work: currentUser.details.occupation,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.details.email
      });
    }
  }

  updateProfile = e => {
    e.preventDefault();

    const {
      firstName,
      lastName,
      email,
      work,
      password,
      confirmPassword
    } = this.state;

    const { token, inputError, updateUserProfile, userId } = this.props;

    let profileData;

    try {
      // Check if first name field is empty
      if (!firstName) {
        const error = new Error("First name can't be empty");

        error.name = "firstName";
        throw error;
      }

      if (!lastName) {
        const error = new Error("Last name can't be empty");

        error.name = "lastName";
        throw error;
      }

      if (!email) {
        const error = new Error("Enter a valid email");

        error.name = "email";
        throw error;
      }

      if (password) {
        // Check if password is minimum length of 10 characters
        if (password.length < 10) {
          const error = new Error(
            "Password must be a minimum of 10 characters long"
          );
          error.name = "password";

          throw error;
        }

        // Check if password matches confirm password
        if (password !== confirmPassword) {
          const error = new Error("Passwords do not match");
          error.name = "password";

          throw error;
        }

        // create profile data
        profileData = {
          firstName,
          lastName,
          email,
          work,
          password
        };

        updateUserProfile(profileData, token, this.props, userId);

        return;
      }

      profileData = {
        firstName,
        lastName,
        email,
        work
      };

      updateUserProfile(profileData, token, this.props, userId);
    } catch (err) {
      inputError(err);
    }
  };

  onChange = e => {
    const value = e.target.value;

    this.setState({ [e.target.name]: value });
  };

  render() {
    const {
      work,
      firstName,
      lastName,
      email,
      password,
      confirmPassword
    } = this.state;

    const { errors, loading, userId } = this.props;

    return (
      <React.Fragment>
        <SecondaryNavigation navTitle="Edit Details" />
        <section className="update-profile">
          <form onSubmit={this.updateProfile} className="update-profile__form">
            {/*** Occupation ***/}
            <div className="update-profile__form-group">
              <div className="update-profile__header">
                <i className="fas fa-briefcase"></i>
                Work
              </div>
              <div className="container">
                <TextInput
                  type="text"
                  name="work"
                  value={work}
                  onChange={this.onChange}
                  className="update-profile__form-input"
                />
              </div>
            </div>

            {/*** Name ***/}
            <div className="update-profile__form-group">
              <div className="update-profile__header">
                <i className="fas fa-user"></i>
                Name
              </div>
              <div className="update-profile__form-control">
                <label htmlFor="firstName">First Name</label>
                <TextInput
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={firstName}
                  onChange={this.onChange}
                  className={
                    errors && errors.name === "firstName"
                      ? "update-profile__form-input form__input--error"
                      : "update-profile__form-input"
                  }
                  error={errors}
                />
              </div>

              <div className="update-profile__form-control">
                <label htmlFor="lastName">Last Name</label>
                <TextInput
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={this.onChange}
                  name="lastName"
                  className={
                    errors && errors.name === "lastName"
                      ? "update-profile__form-input form__input--error"
                      : "update-profile__form-input"
                  }
                  error={errors}
                />
              </div>
            </div>

            {/*** Email ***/}
            <div className="update-profile__form-group">
              <div className="update-profile__header">
                <i className="far fa-envelope"></i>
                Email
              </div>
              <div className="container">
                <TextInput
                  name="email"
                  type="email"
                  value={email}
                  onChange={this.onChange}
                  className={
                    errors && errors.name === "email"
                      ? "update-profile__form-input form__input--error"
                      : "update-profile__form-input"
                  }
                  error={errors}
                />
              </div>
            </div>

            {/*** Password ***/}
            <div className="update-profile__form-group">
              <div className="update-profile__header">
                <i className="fas fa-lock"></i>
                Password
              </div>

              <div className="update-profile__form-control">
                <label htmlFor="password">New Password</label>
                <TextInput
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={this.onChange}
                  className={
                    errors && errors.name === "password"
                      ? "update-profile__form-input form__input--error"
                      : "update-profile__form-input"
                  }
                  error={errors}
                />
              </div>

              <div className="update-profile__form-control">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <TextInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={this.onChange}
                  className="update-profile__form-input"
                />
              </div>
            </div>
            <button
              className={
                loading.value
                  ? "btn btn--login dark-overlay text-grey flex"
                  : "btn btn--login"
              }
              type="submit"
            >
              {loading.value &&
              loading.type === "update profile" &&
              loading.userId === userId ? (
                <Loading />
              ) : null}{" "}
              Save
            </button>
          </form>
        </section>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  loading: state.loading.loading,
  errors: state.errors.error,
  token: state.auth.token,
  userId: state.auth.userId
});

const actions = {
  updateUserProfile,
  inputError
};

export default connect(mapStateToProps, actions)(UpdateProfile);
