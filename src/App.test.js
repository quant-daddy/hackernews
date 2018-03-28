import React from 'react';
import ReactDOM from 'react-dom';
import App, { Button } from './App';
import renderer from 'react-test-rendered';


describe('App', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('has a valid snapshot', () => {
    const component = renderer.create(<App />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })
});


describe('Button', () => {

  it('renders withot crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Button>Button</Button>, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  test('it has a valid snapshot', () => {
    const component = rendered.create(<Button>Give Me More</Button>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});


describe('Table', () => {

  const props = {
    list: [
      { title: '1', author: '2', num_comments: 1, points: 2, objectID: 'y'},
      { title: '13', author: '1', num_comments: 4, points: 1, objectID: 'z'}
    ]
  };

  

})
