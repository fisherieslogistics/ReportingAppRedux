'use strict';
import{
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  ListView,
  RecyclerViewBackedScrollView
} from 'react-native';
import React from 'react';
import Strings from '../constants/Strings.js';

import styles from '../styles/listView';
import colors from '../styles/colors';

class MasterListView extends React.Component {

    renderRow (item, sectionId, rowId) {
      let rowStyle = this.props.isSelected(item, rowId) ? styles.selectedListRow : {}
      return (
        <TouchableHighlight
          onPress={() => {
            this.props.onPress(item, rowId);
          }}
          underlayColor={colors.blue}
          activeOpacity={0.3}
        >
          <View style={[styles.listRow, rowStyle]}>
            <View style={[styles.listRowItemTiny]}>
              {this.props.getIcon(item)}
            </View>
            {this.props.renderDescription(item, sectionId, rowId)}
          </View>
        </TouchableHighlight>);
    }
    renderSeperator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
      return (
        <View
          key={`${sectionID}-${rowID}`}
          style={styles.seperator}
        />
      );
    }

    render () {
      return (
          <ListView
            style={[styles.listView]}
            enableEmptySections={true}
            dataSource={this.props.dataSource}
            renderRow={this.renderRow.bind(this)}
            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
            renderSeparator={this.renderSeperator}
          />
      );
    }
};

export default MasterListView;
