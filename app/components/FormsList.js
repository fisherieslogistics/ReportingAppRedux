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
          style={rowStyle}
        >
          <View>
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
            height: adjacentRowHighlighted ? 4 : 1,
            backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
          }}
        />
      );
    }

    render () {
      return (
        <View style={{height: 600, paddingTop: 25, paddingLeft: 20}}>
          <ListView
            enableEmptySections={true}
            dataSource={this.props.forms}
            renderRow={this.renderRow.bind(this)}
            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
            renderSeparator={this.renderSeperator}
          />
        </View>
      );
    }
};

const styles = StyleSheet.create({
  listRow: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRightColor: '#ccc',
    borderRightWidth: 1,
    width: 165
  },
  selectedListRow: {
    backgroundColor: '#eee',
  },
  listRowItem: {
    paddingRight: 6
  }
});



export default FormsList;
