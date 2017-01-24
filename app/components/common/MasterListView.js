'use strict';
import{
  View,
  TouchableHighlight,
  ListView,
  RecyclerViewBackedScrollView,
} from 'react-native';
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {listViewStyles, colors} from '../../styles/styles';

function renderSeperator(sectionID, rowID) {
  return (
    <View
      key={`${sectionID}-${rowID}`}
      style={listViewStyles.seperator}
    />
  );
}

class MasterListView extends Component {

  constructor(props){
    super(props);
    this.renderScroll = this.renderScroll.bind(this);
    this.renderSeperator = renderSeperator.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  renderRow(item, sectionId, rowId) {
    const selected = this.props.isSelected(item, rowId);
    const rowStyle = selected ? listViewStyles.selectedListRow : {}
    let icon = null;
    if(this.props.getIcon) {
      icon = (
        <View style={[listViewStyles.listRowItemTiny]}>
          {this.props.getIcon(item, selected)}
        </View>
      );
    }
    return (
      <TouchableHighlight
        onPress={() => {
          this.props.onPress(item, rowId);
        }}
        underlayColor={ colors.blue }
        activeOpacity={0.3}
      >
        <View style={[listViewStyles.listRow, rowStyle]}>
          { icon }
          {this.props.getDescription(item, sectionId, rowId, selected)}
        </View>
      </TouchableHighlight>
    );
  }

  renderScroll() {
    return (<RecyclerViewBackedScrollView />);
  }

  render() {
    const renderRow = this.props.renderRow || this.renderRow;
    const tall = { height: this.props.height * 0.6 };
    return (
      <View
        style={[listViewStyles.listViewWrapper, tall, this.props.wrapperStyle]}
      >
        <ListView
          style={[listViewStyles.listView]}
          enableEmptySections
          dataSource={ this.props.dataSource }
          renderRow={ renderRow  }
          renderScrollComponent={this.renderScroll}
          renderSeparator={this.renderSeperator}
        />
      </View>
    );
  }
}

const select = (State) => {
  const state = State.default;
  return {
    height: state.view.height,
  };
}

export default connect(select)(MasterListView)
