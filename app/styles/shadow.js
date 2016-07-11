'use strict';
import {
  StyleSheet,
} from 'react-native';
export default StyleSheet.create({
  shadowDown:{
    shadowColor: "#000000",
    shadowOpacity: 0.25,
    shadowRadius: 1.5,
    shadowOffset: {
      height: 1,
      width: 3
    }
  },
  shadowUp:{
    shadowColor: "#000000",
    shadowOpacity: 0.25,
    shadowRadius: 1.5,
    shadowOffset: {
      height: 1,
      width: 0
    }
  },
  shadowLeft:{
    shadowColor: "#000000",
    shadowOpacity: 0.25,
    shadowRadius: 1.5,
    shadowOffset: {
      height: 0,
      width: 1
    }
  },
  shadowRight:{
    shadowColor: "#000000",
    shadowOpacity: 0.25,
    shadowRadius: 1.5,
    shadowOffset: {
      height: 2,
      width: 1
    }
  }
});
