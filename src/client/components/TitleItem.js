import React, { Component } from "react";
import PropTypes from "prop-types";

import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  min-height: 10rem;
  color: #333;
  background-color: #ccc;
  margin-bottom: 2rem;
`;

const Image = styled.div`
  flex: 1;
  background-image: url('https://image.tmdb.org/t/p/w500/${props => props.bg}');
  background-size:cover;
`;

const Content = styled.div`
  flex: 1;
  padding:3rem;
 
`;

class TitleItem extends Component {
  constructor(props) {
    super(props);
  }



  render() {
    return (
      <Wrapper>
        <Image bg={this.props.title.backdrop_path} />
        <Content>

            <h2>{this.props.title.name} {this.props.title.title}</h2>

            <p>{this.props.title.vote_average}/10 (Based on {this.props.title.vote_count} votes)</p>

            <p>{this.props.title.overview}</p>
       
            </Content>
      
      </Wrapper>
    );
  }
}

TitleItem.propTypes = {};

export default TitleItem;
