import EventEmitter from 'EventEmitter';

const initialState = {
  eventEmitter: new EventEmitter(),
}

export default (state) => initialState
