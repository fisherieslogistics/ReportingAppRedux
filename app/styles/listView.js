'use strict';

import colors from './colors'

export default {
  listRow: {
    flexDirection: 'row',
    flex: 1,
    paddingLeft: 9,
    paddingTop: 6,
    paddingBottom: 6,
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
    marginTop: -20,
    marginRight: 0,
  },
  detail: {
    marginTop: 5
  },
  seperator: {
    height: 1,
    backgroundColor: colors.midGray,
  }
};
