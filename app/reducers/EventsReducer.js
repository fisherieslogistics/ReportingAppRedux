import EventEmitter from 'EventEmitter';
import PositionProvider from '../providers/NativeLocation';

const pos = new PositionProvider();
pos.startUpdatingLocation();

const initialState = {
  eventEmitter: new EventEmitter(),
  uipositionProvider: pos,
}

export default (state) => initialState
