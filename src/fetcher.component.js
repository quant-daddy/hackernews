import React, { Component } from 'react';

const withFetching = url => Comp =>
  class WithFetching extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isLoading: false,
        data: {},
        error: null,
      };
    }

    componentDidMount() {
      this.setState({isLoading: true});
      fetch(url)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Something went wrong!!');
          }
        })
        .then(data => this.setState({isLoading: false, data}))
        .catch(error => this.setState({isLoading: false, error: error}));
    }

    render() {
      <Comp {...this.props} {...this.state} />
    }
  }

}
