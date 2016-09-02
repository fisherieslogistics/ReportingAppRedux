import EventEmitter from 'EventEmitter';
import PositionProvider from '../providers/NativeLocation';

let initialState = {
  eventEmitter: new EventEmitter(),
  uipositionProvider: new PositionProvider()
}

export default (state, action) => {
  return initialState;
}
