import EventEmitter from 'EventEmitter';
import PositionProvider from '../providers/NativeLocation';

const pos = new PositionProvider();
pos.startUpdatingLocation();

let initialState = {
  eventEmitter: new EventEmitter(),
  uipositionProvider: pos,
}

export default (state, action) => {
  return initialState;
}
