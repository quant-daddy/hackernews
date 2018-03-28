import React, { Component } from 'react';
import './App.css';
import Proptypes from 'prop-types';

// const list = [
//   {
//     title: 'React',
//     url: 'https://facebook.github.io/react/',
//     author: 'Jordan Walke',
//     num_comments: 3,
//     points: 4,
//     objectID: 0,
//   }, {
//     title: 'Redux',
//     url: 'https://github.com/reactjs/redux',
//     author: 'Dan Abramov, Andrew Clark',
//     num_comments: 2,
//     points: 5,
//     objectID: 1,
//   },
// ];

const Loading = () => <div>Loading...</div>;

const withLoading = (Component) => ({ isLoading, ...rest}) =>
  isLoading
  ? <Loading />
  : <Component { ...rest } />;


function ListItem(props) {
  const item = props.item;
  return (
    <div >
      <span style={{ width: '40%' }}><a href={item.url}>{item.title}</a></span>
      <span style={{ width: '30%' }}>{item.author}</span>
      <span style={{ width: '10%' }}>{item.num_comments}</span>
      <span style={{ width: '10%' }}>{item.points}</span>
    </div>
  );
}

function Table({list, onDismiss}) {
  return (
    <div className="table">
      {
        list
        .map(item =>
          <div key={item.objectID.toString()} className="table-row">
            <ListItem item={item}/>
            <span>
              <Button  style={{ width: '10%' }}className="button-inline" onClick={() => onDismiss(item.objectID)}>Dismiss</Button>
            </span>
          </div>
        )}
    </div>
  )
}

Table.propTypes = {
  list: Proptypes.arrayOf(
    Proptypes.shape({
      objectID: Proptypes.string.isRequired,
      author: Proptypes.string,
      url: Proptypes.string,
      num_comments: Proptypes.number,
      points: Proptypes.number,
    })
  ).isRequired,
  onDismiss: Proptypes.func.isRequired,
}

function Search({ onSearchChange, value, children, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <input type="text" value={value} onChange={onSearchChange}/>
      <button type="submit">{children}</button>
    </form>
  )
}

class Search extends React.Component {

  componentDidMount() {
    if (this.input) {
      this.input.focus();
    }
  }

  render() {
    const { onSearchChange, value, children, onSubmit } = this.props;
    return (
      <form onSubmit={onSubmit}>
        <input type="text" ref={ node => {this.input = node;} } value={value} onChange={onSearchChange}/>
        <button type="submit">{children}</button>
      </form>
    )
  }

}

Search.propTypes = {
  onSearchChange: Proptypes.func.isRequired,
  value: Proptypes.string.isRequired,
  children: Proptypes.node,
  onSubmit: Proptypes.func.isRequired
}

Search.defaultProps = {
  children: "Click Me!"
}

function Button({ children, onClick, className = '' }) {
  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );
}

Button.proptypes = {
  children: Proptypes.node.isRequired,
  onClick: Proptypes.func,
  className: Proptypes.string.isRequired,
}

Button.defaultProps = {
  className: '',
}

const ButtonWithLoading = withLoading(Button);


const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY,
      isLoading: false,
    };
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  onSearchSubmit(event) {
    event.preventDefault();
    const { searchTerm } = this.state;
    this.fetchSearchTopStories(searchTerm);
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error);
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    this.setState((prevState, props) => {
      const oldHits = page !== 0 ? prevState.result.hits : [];
      const updatedHits = [...oldHits, ...hits];
      return {
        results: {
          ...results,
          [searchKey]: { hits: updatedHits, page }
        },
        isLoading: false
      }
    })
  } 

  onDismiss(id) {
    const updatedHits = this.state.result.hits.filter(item => item.objectID !== id);
    this.setState({
      result: { ...this.state.result, hits: updatedHits }
    });
  }

  onSearchChange(event) {
    this.setState({
      searchTerm: event.target.value
    });
  }

  render() {
    const {searchTerm, result} = this.state;
    const page = (result && result.page) || 0;
    return (
      <div className="page">
        <div className="interactions">
          <ButtonWithLoading isLoading={isLoading} onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}> More </Button>
          <Search onSearchChange={this.onSearchChange} onSubmit={this.onSearchSubmit} value={searchTerm}>Search Yo!</Search>
        </div>
          {result && <Table list={result.hits} onDismiss={this.onDismiss}/>}
      </div>
    )
  }
}


export default App;
export { Button, Table };
