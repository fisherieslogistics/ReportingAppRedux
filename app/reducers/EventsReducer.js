import EventEmitter from 'EventEmitter';
import PositionProvider from '../utils/PositionProvider';

let initialState = {
  eventEmitter: new EventEmitter(),
  uipositionProvider: new PositionProvider()
}

export default (state, action) => {
  switch(action.type){
    case "nativeGPSOn":
      initialState.uipositionProvider.stopIPPosition();
      initialState.uipositionProvider.startPosition();
      return initialState;
    case "ipGpsOn":
      initialState.uipositionProvider.stopNativePosition();
      initialState.uipositionProvider.startIPPosition();
      return initialState;
    case "applyGpsSettings":
      let url = `http://${action.url}:${action.port}`;
      initialState.uipositionProvider.setUrl(url);
      return initialState;
    default:
      return initialState;
  }
}
