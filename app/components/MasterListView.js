'use strict';
import{
  View,
  Text,
  TouchableHighlight,
  ListView,
  RecyclerViewBackedScrollView
} from 'react-native';
import React from 'react';

import {listViewStyles, colors} from '../styles/styles';

const renderSeperator = (sectionID: number, rowID: number, adjacentRowHighlighted: bool) => {
  return (
    <View
      key={`${sectionID}-${rowID}`}
      style={listViewStyles.seperator}
    />
  );
}

const renderRow = (item, sectionId, rowId, props) => {
  let selected = props.isSelected(item, rowId);
  let rowStyle = selected ? listViewStyles.selectedListRow : {}
  return (
    <TouchableHighlight
      onPress={() => {
        props.onPress(item, rowId);
      }}
      underlayColor={colors.blue}
      activeOpacity={0.3}
    >
      <View style={[listViewStyles.listRow, rowStyle]}>
        <View style={[listViewStyles.listRowItemTiny]}>
          {props.getIcon(item, selected)}
        </View>
        {props.getDescription(item, sectionId, rowId, selected)}
      </View>
    </TouchableHighlight>);
}

const MasterListView = (props) => {
  return (
    <ListView
      style={[listViewStyles.listView]}
      enableEmptySections={true}
      dataSource={props.dataSource}
      renderRow={(item, sectionId, rowId) => renderRow(item, sectionId, rowId, props)}
      renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
      renderSeparator={renderSeperator}
    />
  );
};

export {renderSeperator, renderRow}
export default MasterListView
