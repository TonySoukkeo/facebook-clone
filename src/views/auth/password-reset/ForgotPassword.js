import React, { Component } from "react";
import SecondaryNavigation from "../../navigation/SecondaryNavigation";
import TextInput from "../../../common/form/TextInput";
import { connect } from "react-redux";
import { sendResetLink } from "../../../controllers/auth";
import Loading from "../../../common/helpers/Loading";

class ForgotPassword extends Component {
  state = {
    email: ""
  };

  requestResetPassword = e => {
    e.preventDefault();

    const { sendResetLink } = this.props;

    const { email } = this.state;

    sendResetLink(email, this.props);
  };

  onChange = e => {
    const value = e.target.value;

    this.setState({ [e.target.name]: value });
  };

  render() {
    const { email } = this.state,
      { errors, loading } = this.props;

    return (
      <React.Fragment>
        <SecondaryNavigation navTitle="Forgot password" />
        <section className="forgot-password">
          <div className="container">
            <form onSubmit={this.requestResetPassword}>
              <TextInput
                placeholder="Email"
                value={email}
                onChange={this.onChange}
                name="email"
                className={
                  errors && errors.name === "email"
                    ? "form__input--text form__input--error "
                    : "form__input--text "
                }
                error={errors}
              />
              <button
                type="submit"
                className={
                  loading
                    ? "btn btn--create-account mt-md flex dark-overlay text-grey"
                    : "btn btn--create-account mt-md"
                }
              >
                {loading.value ? <Loading /> : null}
                Send reset link
              </button>
            </form>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  errors: state.errors.error,
  loading: state.loading.loading
});

const actions = {
  sendResetLink
};

export default connect(mapStateToProps, actions)(ForgotPassword);
