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
  listViewWrapper: {
    backgroundColor: 'transparent',
    flex: 1,
    padding: 0,
    alignItems: 'stretch',
  },
  listView:{
  },
  detail: {
    marginTop: 5
  },
  seperator: {
    height: 1,
    backgroundColor: colors.midGray,
  }
};
