import React, { Component } from "react";
import { connect } from "react-redux";
import SecondaryNavigation from "../../navigation/SecondaryNavigation";
import { alert } from "../../../controllers/alert";
import { loginUser } from "../../../controllers/auth";
import { SUCCESS } from "../../../redux/reducers/alert/AlertConstants";
import TextInput from "../../../common/form/TextInput";
import { Link } from "react-router-dom";
import Loading from "../../../common/helpers/Loading";

class Login extends Component {
  state = {
    email: "",
    password: "",
    windowWidth: null
  };

  componentDidMount() {
    const { alertData, alert } = this.props;

    this.setWindowWidth();
    window.addEventListener("resize", this.setWindowWidth.bind(this));

    if (alertData && alertData.message) {
      setTimeout(() => {
        alert(SUCCESS, "");
      }, 3000);
    }
  }

  componentWillUnmount() {
    // Clear alert message
    const { alert } = this.props;
    alert(SUCCESS, "");
  }

  setWindowWidth = () => {
    this.setState({ windowWidth: window.innerWidth });
  };

  login = e => {
    e.preventDefault();

    const { email, password } = this.state;
    const { loginUser } = this.props;

    loginUser(email, password, this.props);

    // Clear password field
    this.setState({ password: "" });
  };

  onChange = e => {
    const value = e.target.value;

    this.setState({ [e.target.name]: value });
  };

  render() {
    const { alertData, errors, loading } = this.props,
      { email, password, windowWidth } = this.state;

    let alertDiv;

    if (alertData && alertData.message) {
      alertDiv = (
        <div
          className={
            alertData.type === "success"
              ? "alert alert--success"
              : "alert alert--error"
          }
        >
          {alertData.message}
        </div>
      );
    }

    return (
      <React.Fragment>
        {windowWidth < 790 ? <SecondaryNavigation navTitle="Login" /> : null}

        <section className="login">
          <div className="container">
            {alertDiv}
            <form onSubmit={this.login} className="container form">
              <TextInput
                name="email"
                placeholder="Email"
                type="email"
                value={email}
                onChange={this.onChange}
                className={
                  errors && errors.name === "email"
                    ? "form__input--text form__input--error input-email-stacked"
                    : "form__input--text input-email-stacked"
                }
                error={errors}
              />

              <TextInput
                name="password"
                placeholder="Password"
                type="password"
                value={password}
                onChange={this.onChange}
                className={
                  errors && errors.name === "password"
                    ? "form__input--text form__input--error input-password-stacked"
                    : "form__input--text input-password-stacked"
                }
                error={errors}
              />
              <button
                className={
                  loading.value
                    ? "btn btn--login mt-sm dark-overlay text-grey flex"
                    : "btn btn--login mt-sm"
                }
                type="submit"
              >
                {loading.value ? <Loading /> : null} Log In
              </button>
            </form>

            <div className="login__footer">
              <div className="login__footer-or">
                <div className="login__footer-or--line"></div>
                <p>or</p>
                <div className="login__footer-or--line"></div>
              </div>

              <Link
                to="/register"
                className="btn btn--create-account mt-md mb-sm"
              >
                Create New Account
              </Link>

              <Link to="/forgot-password" className="forgot-password-link">
                Forgot Password?
              </Link>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  alertData: state.alert.alert,
  errors: state.errors.error,
  loading: state.loading.loading
});

const actions = {
  alert,
  loginUser
};

export default connect(mapStateToProps, actions)(Login);
