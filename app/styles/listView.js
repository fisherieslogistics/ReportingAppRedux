'use strict';
import{
  StyleSheet,
} from 'react-native';

import colors from './colors'

export default StyleSheet.create({
  listRow: {
    flexDirection: 'row',
    flex: 1,
    paddingLeft: 15,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: colors.white,
  },
  selectedListRow: {
    backgroundColor: colors.highlightBlue,
  },
  listRowItem: {
    flex: 0.5,
  },
  listRowItemTiny: {
    flex: 0.1,
  },
  listRowItemNarrow:{
    flex: 0.20,
    justifyContent: 'flex-start'
  },
  alignRight: {
    alignItems: 'flex-end'
  },
  listView:{
    marginTop: -18,
    marginRight: 1,
  },
  detail: {
    marginTop: 5
  },
  seperator: {
    height: 1,
    backgroundColor: colors.midGray,
  }
});
