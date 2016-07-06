"use strict";

function positionUpdate(position) {
  return {
      type: 'uiPositionUpdate',
      position: position
  };
}

export {positionUpdate};
