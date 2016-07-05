"use strict";

const addToQueue = (name, obj) => {
  return {
      type: 'addToQueue',
      name: name,
      item: obj
  };
};

const addToKeyStore = (name, guid) => {
  return {
      type: 'addToKeyStore',
      guid: guid,
      name: name
  };
}

const removeFromQueue = (name) => {
  return {
      type: 'removeFromQueue',
      name: name
  };
}

const removeFromKeyStore = (name, guid) => {
  return {
      type: 'removeFromKeyStore',
      guid: guid,
      name: name
  };
}

const clearQueue = (name, index) => {
  return {
      type: 'clearQueue',
      name: name
  };
}

export {
        addToQueue,
        addToKeyStore,
        removeFromQueue,
        removeFromKeyStore,
        clearQueue
       }
