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
import inputStyle from '../styles/inputStyle';

const editor = new Editor();

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

    renderInputs(){
      const model = FishingEventModel.concat(TCERFishingEventModel);
      let inputs = [];
      let labels = []
      model.forEach((attribute) => {
          if(attribute.readOnly || attribute.hidden) {
              return;
          }
          inputs.push(this.renderRow(attribute));
      });
      return inputs;
    }

    renderRow(attribute){
      let input = editor.editor(attribute,
                           this.props.fishingEvent[attribute.id],
                           this.onChangeText.bind(this));
      if(!input){
        return null;
      }
      let _style = [styles.col, inputStyle.inputWrapper];
      if(attribute.type === "datetime"){
        _style.push({paddingLeft: 22, paddingBottom: 4});
      }
      return (
        <View style={[inputStyle.inputRow]}>
          <View style={_style}>
            {input}
          </View>
          <View style={[styles.col, inputStyle.labelWrapper]}>
            <Text style={inputStyle.label}>
              {attribute.label}
            </Text>
          </View>
        </View>
      );
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

    render() {
      if(!this.props.fishingEvent){
        return null;
      }
      return (
        <View style={[styles.row, {flex: 1}]}>
          <View style={[styles.col, {flex: 1}]}>
            {this.renderInputs()}
          </View>
        </View>
      );
    }
};

const styles = StyleSheet.create({
  col:{
    flexDirection: 'column',
  },
  row:{
    flexDirection: 'row',
  },
});


export default FishingEventEditor;
