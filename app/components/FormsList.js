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
import {connect} from 'react-redux';
import FormActions from '../actions/FormActions';
import Strings from '../constants/Strings.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import Helper from '../utils/Helper';
import FishingEventModel from '../models/FishingEventModel';
import TCERFishingEventModel from '../models/TCERFishingEventModel';
import colors from '../styles/colors';

const helper = new Helper();
const Lang = Strings.english;

const fishingEventModel = FishingEventModel.concat(TCERFishingEventModel);
const formActions = new FormActions();
class FormsList extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        selectedListRow: null
      }
    }

    setViewingForm(id){
      this.props.dispatch(formActions.setViewingForm(id));
    }
    renderRow (form, sectionID, rowID) {
      let rowStyle = [styles.listRow];
      if(rowID === this.state.selectedListRow){
        rowStyle.push(styles.selectedListRow);
      }
      return (
        <TouchableHighlight
          onPress={() => {
            this.setState({selectedListRow: rowID.toString()});
            this.props.onSelect(form);
          }}
          underlayColor={colors.blue}
          activeOpacity={0.3}
        >
          <View style={rowStyle}>
            <Text style={[styles.listRowItem]}>
              {"TCER Form " + form.fishingEvents.length + " shots" }
            </Text>
          </View>
        </TouchableHighlight>);
    }
    renderSeperator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
      return (
        <View
          key={`${sectionID}-${rowID}`}
          style={{
            height: 1,
            backgroundColor: colors.midGray,
          }}
        />
      );
    }

    render () {
      return (
        <ListView
          enableEmptySections={true}
          dataSource={this.props.forms}
          renderRow={this.renderRow.bind(this)}
          renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
          renderSeparator={this.renderSeperator}
        />
      );
    }
};

const styles = StyleSheet.create({
  listRow: {
    flexDirection: 'row',
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: colors.white
  },
  selectedListRow: {
    backgroundColor: colors.blue,
  },
  listRowItem: {
    flex: 0.5
  },
  listRowItemNarrow: {
    flex: 0.25,
  },
  listRowItemTiny:{
    flex: 0.1,
  },
  listItemText: {
    fontSize: 19,
    color: colors.midGray
  },
  listView:{
    marginTop: -20
  }
});



export default FormsList;
