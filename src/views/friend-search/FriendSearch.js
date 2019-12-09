import React, { Component } from "react";
import SecondaryNavigation from "../navigation/SecondaryNavigation";
import SearchInput from "../../components/SearchInput";

class FriendSearch extends Component {
  render() {
    return (
      <React.Fragment>
        <SecondaryNavigation navTitle="Facebook Search" />
        <section className="friend-search">
          <SearchInput />
        </section>
      </React.Fragment>
    );
  }
}

export default FriendSearch;
