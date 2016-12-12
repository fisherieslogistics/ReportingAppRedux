'use strict';
import{
  View,
  Text,
  TouchableHighlight,
  ListView,
  RecyclerViewBackedScrollView
} from 'react-native';
import React from 'react';

import {listViewStyles, colors} from '../../styles/styles';

const renderSeperator = (sectionID: number, rowID: number, adjacentRowHighlighted: bool) => (
    <View
      key={`${sectionID}-${rowID}`}
      style={listViewStyles.seperator}
    />
  )

const renderRow = (item, sectionId, rowId, props) => {
  const selected = props.isSelected(item, rowId);
  const rowStyle = selected ? listViewStyles.selectedListRow : {}
  let icon = null;
  if(props.getIcon) {
    icon = (
      <View style={[listViewStyles.listRowItemTiny]}>
        {props.getIcon(item, selected)}
      </View>
    );
  }
  return (
    <TouchableHighlight
      onPress={() => {
        props.onPress(item, rowId);
      }}
      underlayColor={ colors.blue }
      activeOpacity={0.3}
    >
      <View style={[listViewStyles.listRow, rowStyle]}>
        { icon }
        {props.getDescription(item, sectionId, rowId, selected)}
      </View>
    </TouchableHighlight>);
}

const renderScroll = (props) => (<RecyclerViewBackedScrollView {...props} />);

const MasterListView = (props) => {
  let renderAddProps = (item, sectionId, rowId) => renderRow(item, sectionId, rowId, props);
  if(props.renderRow) {
    renderAddProps = (item, sectionId, rowId) => props.renderRow(item, sectionId, rowId, props);
  }
  return (
    <ListView
      style={[listViewStyles.listView]}
      enableEmptySections
      dataSource={props.dataSource}
      renderRow={renderAddProps}
      renderScrollComponent={renderScroll}
      renderSeparator={renderSeperator}
    />
  );
}

export {renderSeperator, renderRow}
export default MasterListView
