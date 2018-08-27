import React, { Component } from "react";
import "./app.css";
import TitleWrapper from './components/TitleWrapper';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      ratings: []
    };
  }

  componentDidMount() {
    fetch("/api/getUsername")
      .then(res => res.json())
      .then(user => this.setState({ user: user }));

    fetch("/api/getRatings")
      .then(res => res.json())
      .then(ratings => this.setState({ ratings: ratings }));
  }

  render() {
    return (
      <div>
        {this.state.user ? (
          <h1>Hello {this.state.user.username}</h1>
        ) : (
          <h1>Loading.. please wait!</h1>
        )}

        <TitleWrapper titles={this.state.ratings}/>
      </div>
    );
  }
}
