'use strict';
import{
  View,
  Text,
} from 'react-native';
import React from 'react';
import colors from '../styles/darkColors.js';
import MasterListView from './common/MasterListView';
import styles from '../styles/listView';

class TotalsList extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        selectedCode: "",
      }
      this.getDescription = this.getDescription.bind(this);
      this.isSelected = this.isSelected.bind(this);
    }

    isSelected(code){
      return this.state.selectedCode === code;
    }

    renderRow(item, sectionId, rowId, props) {
      const rowStyle = { backgroundColor: colors.transparent };
      return (
        <View style={[styles.listRow, rowStyle]}>
          { props.getDescription(item, sectionId, rowId) }
        </View>
      )
    }

    getDescription(total) {
      const textStyle = {
        color: colors.green,
        fontSize: 18,
      }
      const details = [
        total.code,
        total.weight,
      ];

      return details.map((detail, i) => (
        <View
          style={ [styles.listRowItemNarrow, {backgroundColor: colors.transparent}] }
          key={"totals_list" + i}
        >
          <Text
            style={ textStyle }
          >
            { detail }
          </Text>
        </View>
      ));
    }

    renderIcon(){
      return null;
    }

    onPress() {
      return null;
    }

    render () {
      return (
        <MasterListView
          getDescription={ this.getDescription }
          isSelected={ this.isSelected }
          onPress={ this.props.onPress }
          dataSource={ this.props.data }
          getIcon={ this.renderIcon }
          renderRow={ this.renderRow }
        />
      );
    }
}

export default TotalsList;
