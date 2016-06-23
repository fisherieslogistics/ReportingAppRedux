'use strict';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  ScrollView,
  Switch,
  AlertIOS,
  Dimensions,
  TextInput,
} from 'react-native';

import React from 'react';
import FishingEventActions from '../actions/FishingEventActions';
import {connect} from 'react-redux';
import FishingEventModel from '../models/FishingEventModel';
import TCERFishingEventModel from '../models/TCERFishingEventModel';
import DatePicker from 'react-native-datepicker';
import FishPicker from './FishPicker';
import Sexagesimal from 'sexagesimal';
import Errors from './Errors';
import Editor from '../utils/Editor';
import moment from 'moment';
import Strings from '../constants/Strings'

const editor = new Editor();
const fishingEventTypeModels = {
  "tcer": TCERFishingEventModel
}

const fishingEventActions = new FishingEventActions();

class FishingEventEditor extends React.Component{
    constructor (props){
        super(props);
        this.state = {
          strings: Strings.english.fishingEvents[props.fishingEventType]
        }
    }

    onChangeText(name, value) {
        this.props.dispatch(
          fishingEventActions.setfishingEventValue(this.props.fishingEvent.id, name, value));
    }

    onNonFishChange(name, value){
      if(value){
        AlertIOS.alert(
          'Non Fish are you sure?',
          'You will need to fill out a Non Fish Protected Species Form in you form book',
          [
            {text: 'Cancel', onPress: () => {this.onChangeText(name, false)}, style: 'cancel'},
            {text: 'OK', onPress: () => {this.onChangeText(name, true)}}
          ]
        );
      }else{
        this.onChangeText(name, false);
      }
    }

    renderFishingEventModelInputs(type){
      let model = type ? fishingEventTypeModels[type] : FishingEventModel;
      let inputs = [];
      model.forEach((attribute) => {
          if(attribute.readOnly || attribute.hidden) {
              return;
          }
          inputs.push(this.renderRow(attribute));
      });
      return inputs;
    }

    getCallback(attr){
      switch (attr.type) {
        case "bool":
          return this.onNonFishChange
          break;
        default:
          return this.onChangeText
      }
    }

    renderRow(attribute){
      let value = this.props.fishingEvent[attribute.id];
      let input = editor.editor(attribute, value, this.getCallback(attribute).bind(this), styles);
      let rowStyle = [styles.tableRow];
      return (
        <View style={rowStyle} key={attribute.id + "editor"}>
          <View style={[styles.tableCell]}>
            <Text>{attribute.label}</Text>
          </View>
          <View style={[styles.tableCell]}>
            {input}
          </View>
        </View>
      );
    }

    renderCombinedErrors(){
      return null;
      let model = [...FishingEventModel,
                   ...fishingEventTypeModels[this.props.fishingEventType]];
      return (<Errors model={model}
                      obj={this.props.fishingEvent}
                      combinedErrors={true}
              />);
    }

    render() {
      if(!this.props.fishingEvent){
        return null;
      }
      return (
        <ScrollView>
          <View style={styles.tableWrapper}>
            <View style={styles.row}>
              <View style={[styles.tableView]}>
                {this.renderFishingEventModelInputs(false)}
              </View>
              <View style={[styles.tableView]}>
                {this.renderFishingEventModelInputs("tcer")}
              </View>
            </View>
            {this.renderCombinedErrors()}
          </View>
        </ScrollView>
        );
    }
};

const select = (State, dispatch) => {
    let state = State.default;
    return {
      fishingEvent: state.fishingEvents.events[state.view.viewingFishingEventId - 1],
      fishingEventType: state.me.user.fishingEventType
    };
}

const styles = StyleSheet.create({
  row:{
    flexDirection: 'row'
  },
  tableWrapper: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection:'row'
  },
  tableView: {
    marginTop: 20,
    flexDirection: 'column',
    width: 350
  },
  tableRow: {
    flexDirection: 'row',
    paddingBottom: 20,
    width: 175,
    height: 50
  },
  tableCell: {
    width: 135,
  },
  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
    height: 30,
    width: 80,
    paddingLeft: 10,
  },
  invalid: {
    backgroundColor: '#FFB3BA'
  },
});


export default connect(select)(FishingEventEditor);
