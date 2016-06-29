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
import colors from '../styles/colors';
const editor = new Editor();
const fishingEventActions = new FishingEventActions();

class EventDetailEditor extends React.Component{
    constructor (props){
        super(props);
        this.state = {
          strings: Strings.english.fishingEvents[props.fishingEventType],
          model: FishingEventModel.concat(TCERFishingEventModel)
        }
    }

    onChange(name, value){
      switch (name) {
        case "nonFishProtected":
          this.onNonFishChange(name, value);
          break;
        default:
          this.onChangeText(name, value);
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

    renderEditors(){
      let inputs = [];
      let labels = []
      this.state.model.forEach((attribute) => {
          if(attribute.readOnly || attribute.hidden) {
              return;
          }
          inputs.push(this.renderEditor(attribute));
      });
      return inputs;
    }

    getEditor(attribute){
      let inputId = attribute.id + "__event__" + this.props.fishingEvent.id;
      return editor.editor(attribute,
                     this.props.fishingEvent[attribute.id],
                     this.onChange.bind(this),
                     {fishingEvent: this.props.fishingEvent},
                     inputId);
    }

    renderSingleEditor(attribute, index){
      return (
        <View style={[styles.col, styles.inputRow]} key={attribute.id}>
            <View style={[styles.row, styles.labelRow]}>
              <Text style={styles.labelText}>{attribute.label}</Text>
            </View>
            <View style={[styles.row, styles.editorRow]}>
              {this.getEditor(attribute, attribute.id + "_product_" + index)}
            </View>
        </View>
      );
    }

    renderCombinedEditors(editors, key){
      return (
        <View style={[styles.col, styles.inputRow]} key={key + Math.random().toString()}>
          <View style={[styles.row]}>
            {editors.map((e) => {
              return (
                  <View style={[styles.third]} key={e.label + e.id + key}>
                    <View style={[styles.labelRow]}>
                      <Text style={styles.labelText}>{e.label}</Text>
                    </View>
                    <View style={[styles.editorRow]}>
                      {e.editor}
                    </View>
                </View>
              );
            })}
          </View>
        </View>
      );
    }

    renderEditor(attribute){
      if(attribute.editorDisplay && attribute.editorDisplay.hideNull && this.props.fishingEvent[attribute.id] === null){
        return null;
      }
      if(attribute.editorDisplay && attribute.editorDisplay.editor === this.props.editorType){
        switch (attribute.editorDisplay.type) {
          case "single":
            return this.renderSingleEditor(attribute);
            break;
          case "combined":
            let editors = [{label: attribute.label, editor: this.getEditor(attribute)}];
            let addedEditors = attribute.editorDisplay.siblings.map((s) => {
                let attr = this.state.model.find((a) => {
                             return a.id === s;
                            });
                return {label: attr.label, editor: this.getEditor(attr)};
            });
            return this.renderCombinedEditors(editors.concat(addedEditors), attribute.id);
          default:
        }
      }
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
        <View style={[styles.col, styles.fill, {alignSelf: 'flex-start'}, styles.wrapper]}>
          {this.renderEditors()}
        </View>
      );
    }
};

const styles = StyleSheet.create({
  wrapper:{
   backgroundColor: '#fff',
   margin: 15,
   marginRight: 18,
   borderRadius: 10,
   paddingTop: 10,
   paddingLeft: 30,
   paddingBottom: 10,
  },
  col:{
    flexDirection: 'column',
  },
  row:{
    flexDirection: 'row',
  },
  inputRow: {
    paddingTop: 5,
    alignSelf: 'stretch',
    borderBottomWidth: 1,
    borderBottomColor: colors.midGray
  },
  editorRow: {
    flex: 0.7,
    paddingBottom: 3
  },
  fill: {
    flex: 1,
  },
  labelRow: {
    flex: 0.3,
  },
  labelText: {
    color: colors.blue
  },
  third: {
    flex: 0.3
  }
});


export default EventDetailEditor;
