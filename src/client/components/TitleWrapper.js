import React, { Component } from "react";
import TitleItem from './TitleItem'



class TitleWrapper extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    const listTitles = this.props.titles.map(title => (
      <TitleItem key={title.id} title={title}/>
    ));
    return <ul>{listTitles}</ul>;
  }
}

// Specifies the default values for props:
TitleWrapper.defaultProps = {
  titles: []
};

export default TitleWrapper;
