function firstEventValue(fishingEvents, id){
  if(typeof id === 'function'){
    return id(fishingEvents[0]);
  }
  return fishingEvents[0][id];
};

export {firstEventValue}
