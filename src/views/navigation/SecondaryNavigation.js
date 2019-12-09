import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { error } from "../../controllers/error-handling";

class SecondaryNavigation extends Component {
  onClickBack = () => {
    const { error } = this.props;
    // Clear any error messages that may exists
    error(null);

    this.props.history.goBack();
  };

  render() {
    const { navTitle } = this.props;
    return (
      <nav className="navigation-secondary container">
        <span onClick={this.onClickBack}>
          <i className="fas fa-arrow-left"></i>
        </span>
        <div className="navigation-secondary__title">{navTitle}</div>
      </nav>
    );
  }
}

const actions = {
  error
};

export default compose(withRouter, connect(null, actions))(SecondaryNavigation);
