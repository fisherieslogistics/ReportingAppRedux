'use strict';
import{
  StyleSheet,
} from 'react-native';

import colors from './colors'

export default StyleSheet.create({
  listRow: {
    flexDirection: 'row',
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    backgroundColor: colors.white
  },
  selectedListRow: {
    backgroundColor: colors.blue,
  },
  listRowItem: {
    flex: 0.5,
  },
  listRowItemTiny: {
    flex: 0.1,
  },
  listRowItemNarrow:{
    flex: 0.25,
  },
  lightText: {
    fontSize: 19,
    color: colors.midGray
  },
  darkText: {
    fontSize: 19,
    color: colors.darkGrey
  },
  blackText: {
    fontSize: 19,
    color: "black"
  },
  alignRight: {
    alignItems: 'flex-end'
  },
  listView:{
    marginTop: -20
  },
  seperator: {
    height: 1,
    backgroundColor: colors.midGray,
  }
});
