import React, { Component } from "react";
import SecondaryNavigation from "../../navigation/SecondaryNavigation";
import TextInput from "../../../common/form/TextInput";
import { registerUser } from "../../../controllers/auth";
import { loading } from "../../../controllers/loading";
import { connect } from "react-redux";
import Loading from "../../../common/helpers/Loading";

class Register extends Component {
  state = {
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    password: "",
    confirmPassword: "",
    email: "",
    windowWidth: null
  };

  componentDidMount() {
    this.setWindowWidth();
    window.addEventListener("resize", this.setWindowWidth.bind(this));
  }

  setWindowWidth = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  onChange = e => {
    const value = e.target.value;

    this.setState({ [e.target.name]: value });
  };

  register = async e => {
    e.preventDefault();

    const { registerUser, loading } = this.props;
    const {
      firstName,
      lastName,
      dob,
      gender,
      password,
      confirmPassword,
      email
    } = this.state;

    loading(true);
    await registerUser(
      {
        firstName,
        lastName,
        email,
        confirmPassword,
        password,
        gender,
        dob
      },
      this.props
    );
    loading(false);
  };

  render() {
    const {
      firstName,
      lastName,
      dob,
      password,
      confirmPassword,
      email,
      windowWidth
    } = this.state;

    const { errors, isLoading } = this.props;

    return (
      <React.Fragment>
        {windowWidth < 790 ? (
          <SecondaryNavigation navTitle="Join Facebook" />
        ) : null}

        <section className="register">
          <form onSubmit={this.register} className="registerForm container">
            <div className="form__group">
              <div className="form__control">
                <label htmlFor="firstname" className="form__label">
                  First Name
                </label>
                <TextInput
                  id="#firstName"
                  type="text"
                  name="firstName"
                  value={firstName}
                  onChange={this.onChange}
                  className={
                    errors && errors.name === "firstName"
                      ? "form__input--text form__input--error"
                      : "form__input--text"
                  }
                  error={errors}
                />
              </div>

              <div className="form__control">
                <label htmlFor="lastname" className="form__label">
                  Last Name
                </label>
                <TextInput
                  id="#lastName"
                  type="text"
                  name="lastName"
                  value={lastName}
                  onChange={this.onChange}
                  className={
                    errors && errors.name === "lastName"
                      ? "form__input--text form__input--error"
                      : "form__input--text"
                  }
                  error={errors}
                />
              </div>

              <div className="form__control">
                <label htmlFor="email" className="form__label">
                  Email
                </label>
                <TextInput
                  id="#email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={this.onChange}
                  className={
                    errors && errors.name === "email"
                      ? "form__input--text form__input--error"
                      : "form__input--text"
                  }
                  error={errors}
                />
              </div>

              <div className="form__control form__control--gender">
                <div className="form__group form__group--gender">
                  <label htmlFor="gender" className="form__label">
                    Male
                  </label>
                  <TextInput
                    id="#gender"
                    type="radio"
                    name="gender"
                    value="male"
                    onChange={this.onChange}
                    className="form__input--radio"
                  />
                </div>

                <div className="form__group form__group--gender">
                  <label htmlFor="gender" className="form__label">
                    Female
                  </label>
                  <TextInput
                    id="#gender"
                    type="radio"
                    name="gender"
                    value="female"
                    onChange={this.onChange}
                    className="form__input--radio"
                  />
                </div>
                {errors && errors.name === "gender" ? (
                  <div className="error-input">{errors.message}</div>
                ) : null}
              </div>

              <div className="form__control">
                <label htmlFor="dob" className="form__label">
                  Date of birth
                </label>
                <TextInput
                  id="#dob"
                  type="date"
                  name="dob"
                  value={dob}
                  onChange={this.onChange}
                  className={
                    errors && errors.name === "dob"
                      ? "form__input--text form__input--error"
                      : "form__input--text"
                  }
                  error={errors}
                />
              </div>

              <div className="form__control">
                <label htmlFor="password" className="form__label">
                  Password
                </label>
                <TextInput
                  id="#password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={this.onChange}
                  className={
                    errors && errors.name === "password"
                      ? "form__input--text form__input--error"
                      : "form__input--text"
                  }
                  error={errors}
                />
              </div>

              <div className="form__control">
                <label htmlFor="confirmPassword" className="form__label">
                  Confirm Password
                </label>
                <TextInput
                  id="#confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={this.onChange}
                  className={
                    errors && errors.name === "password"
                      ? "form__input--text form__input--error"
                      : "form__input--text"
                  }
                  error={errors}
                />
              </div>
            </div>

            <button
              className={
                isLoading
                  ? "btn btn--auth mt-md flex dark-overlay text-grey"
                  : "btn btn--auth mt-md"
              }
              type="submit"
            >
              {isLoading.value ? <Loading /> : null}Register
            </button>
          </form>
        </section>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.loading.loading,
  errors: state.errors.error
});

const actions = {
  registerUser,
  loading
};

export default connect(mapStateToProps, actions)(Register);
