import * as types from './actionTypes';

class CounterActions{
  increment() {
    return {
      type: types.INCREMENT
    };
  }

  decrement() {
    return {
      type: types.DECREMENT
    };
  }
}

export default CounterActions;
