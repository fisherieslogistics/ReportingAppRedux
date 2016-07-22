import EventEmitter from 'EventEmitter';
import PositionProvider from '../utils/PositionProvider';

const initialState = {
  eventEmitter: new EventEmitter(),
  uipositionProvider: new PositionProvider()
}

export default (state = initialState, action) => {
  switch(action.type){
    case "nativeGPSOn":
      state.uipositionProvider.stopIPPosition();
      state.uipositionProvider.startPosition();
      return state;
    case "ipGpsOn":
      state.uipositionProvider.stopNativePosition();
      state.uipositionProvider.startIPPosition();
      return state;
    case "applyGpsSettings":
      let url = `http://${action.url}:${action.port}`;
      state.uipositionProvider.setUrl(url);
      return state;
    default:
      return state;
  }
}
