import React, { Component } from "react";
import SecondaryNavigation from "../../navigation/SecondaryNavigation";
import TextInput from "../../../common/form/TextInput";
import { connect } from "react-redux";
import { alert } from "../../../controllers/alert";
import { ERROR } from "../../../redux/reducers/alert/AlertConstants";
import { changePassword } from "../../../controllers/auth";
import Loading from "../../../common/helpers/Loading";

class PasswordReset extends Component {
  state = {
    password: "",
    resetToken: ""
  };

  async componentDidMount() {
    const resetToken = this.props.match.params.resetToken;
    const { alert } = this.props;

    const data = await fetch(
      `${process.env.REACT_APP_API_URI}/auth/password-reset/${resetToken}`
    ).then(async res => await res.json());

    if (data.status !== 200) {
      alert(ERROR, { message: data.message, type: "error" });
      // Redirect back to home page
      setTimeout(() => this.props.history.push("/"), 5000);
    }

    // Set state with resetToken
    this.setState({ resetToken: resetToken });
  }

  changePassword = e => {
    e.preventDefault();

    const { changePassword } = this.props,
      { resetToken, password } = this.state;

    changePassword(password, resetToken, this.props);
  };

  onChange = e => {
    const value = e.target.value;

    this.setState({ [e.target.name]: value });
  };

  render() {
    const { errors, alertMessage, loading } = this.props,
      { password } = this.state;

    let view;

    if (!alertMessage) {
      view = (
        <form onSubmit={this.changePassword}>
          <TextInput
            type="password"
            placeholder="Enter new password"
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

          <button
            type="submit"
            className={
              loading
                ? "btn btn--create-account flex dark-overlay mt-md"
                : "btn btn--create-account mt-md"
            }
          >
            {loading.value ? <Loading /> : null}
            Reset Password
          </button>
        </form>
      );
    } else {
      view = (
        <React.Fragment>
          <div className="alert alert--error">{alertMessage.message}</div>
          <div className="text-center alert--error-text mt-md">
            You will be redirected back to the homepage in 5 seconds
          </div>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <SecondaryNavigation navTitle="Password Reset" />
        <section className="password-reset">
          <div className="container">{view}</div>
        </section>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  errors: state.errors.error,
  alertMessage: state.alert.alert,
  loading: state.loading.loading
});

const actions = {
  alert,
  changePassword
};

export default connect(mapStateToProps, actions)(PasswordReset);
