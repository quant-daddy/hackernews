import React, {Component} from 'react';


class CommentList extends React.component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      comments: DataSource.getComments();
    }
  }

  componentDidMount() {
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState({
      comments: DataSource.getComments();
    })
  }

  render() {
    return (
      <div>
        {(this.comments.map((comment) => {
          <Comment comment={comment} key={comment.id} />
        }))}
      </div>
    )
  }

}

const CommentsListWithSubscription = withSubscription(CommentList, /* intent */(DataSource) => DataSource.getComments())

// HOCs should be pure functions.
function withSubscription(WrapperComponent, selectedData) {

  return class extends Component {

    constructor(props) {
      super(props);
      this.state = {
        data: selectedData(DataSource, props),
      };
      this.handleChange.bind(this);
    }

    componentDidMount() {
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectedData(DataSource, this.props);
      });
    }

    render() {
      return (
        <WrapperComponent {...this.props} data={this.state.data} />
      )
    }
  }
}


function withSubscription(selectedData) {

  return function(WrapperComponent) {

    return class extends Component {

      constructor(props) {
        super(props);
        this.state = {
          data: selectedData(DataSource, props),
        };
        this.handleChange.bind(this);
      }

      componentDidMount() {
        DataSource.addChangeListener(this.handleChange);
      }

      componentWillUnmount() {
        DataSource.removeChangeListener(this.handleChange);
      }

      handleChange() {
        this.setState({
          data: selectedData(DataSource, this.props);
        });
      }

      render() {
        return (
          <WrapperComponent {...this.props} data={this.state.data} />
        )
      }
    }
  }
}
