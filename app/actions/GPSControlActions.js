"use strict";

class GPSControlActions{

    nativeGPSOn(){
      return {
        type: "nativeGPSOn"
      };
    }
    ipGpsOn(){
      return {
        type: "ipGpsOn"
      };
    }
    nativeGPSOff(){
      return {
        type: "nativeGPSOff"
      };
    }
    ipGpsOff(){
      return {
        type: "ipGpsOff"
      };
    }
    setGpsUrl(url){
      return {
        type: "setGpsUrl",
        url
      };
    }
    setGpsPort(port){
      return {
        type: "setGpsPort",
        port
      };
    }
    setGpsBaud(baud){
      return {
        type: "setGpsBaud",
        baud
      };
    }
    applyGpsSettings(url, port, baud){
      return {
        type: "applyGpsSettings",
        url,
        port,
        baud
      };
    }
}

export default GPSControlActions;
