import EventEmitter from 'EventEmitter';
const emitter = new EventEmitter();

const initialState = {
  eventEmitter: emitter,
}

export default (state) => initialState
