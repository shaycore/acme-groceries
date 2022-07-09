import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import axios from 'axios';


const initialState = {
  groceries: [],
  view: ''
};

const viewReducer = (state='',action)=> {
  if(action.type === 'SET_VIEW'){
    return action.view;
  }
  return state;
};

const groceriesReducer = (state = [], action)=> {
  if(action.type === 'LOAD'){
    return action.groceries;
  }
  if(action.type === 'UPDATE'){
    return state.map(grocery => grocery.id === action.grocery.id ? action.grocery : grocery );
  }
  if(action.type === 'CREATE'){
    return [...state, action.grocery ];
  }
  return state;
};

const reducer = combineReducers({
  view: viewReducer,
  groceries: groceriesReducer
});

const updateGrocery = (grocery) => {
  return async(dispatch)=> {
    grocery = (await axios.put( `/api/groceries/${grocery.id}`, grocery )).data;
    dispatch({ type: 'UPDATE', grocery });
  };
};

const createRandomGrocery = () => {
  return async(dispatch)=> {
    let grocery = (await axios.post('/api/groceries/random')).data;
    dispatch({ type: 'CREATE', grocery });
  };
};

const createGrocery = (name) => {
  return async(dispatch)=> {
    const grocery = (await axios.post('/api/groceries', { name } )).data;
    dispatch({ type: 'CREATE', grocery });
  };
};


const store = createStore(reducer, applyMiddleware(logger, thunk));

export { updateGrocery, createRandomGrocery, createGrocery }

export default store;


