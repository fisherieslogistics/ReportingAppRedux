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
        url: url
      };
    }
    setGpsPort(port){
      return {
        type: "setGpsPort",
        port: port
      };
    }
    setGpsBaud(baud){
      return {
        type: "setGpsBaud",
        baud: baud
      };
    }
    applyGpsSettings(url, port, baud){
      return {
        type: "applyGpsSettings",
        url: url,
        port: port,
        baud: baud
      };
    }
}

export default GPSControlActions;


