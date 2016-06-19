'use strict';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
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
import FishingEventModel from '../models/FishingEvent';
import TCERFishingEvent from '../models/TCERFishingEvent';

const fishingEventTypeModels = {
  "tcer": TCERFishingEvent
}

const fishingEventActions = new FishingEventActions();

class FishingEventEditor extends React.Component{
    constructor (){
        super();
    }

    onTextChange(name, value) {
        this.props.dispatch(
          fishingEventActions.setfishingEventValue(this.props.fishingEvent.id, name, value));
    }

    onNonFishChange(value, name){
      if(value){
        AlertIOS.alert(
          'Non Fish are you sure?',
          'You will need to fill out a Non Fish Protected Species Form in you form book',
          [
            {text: 'Cancel', onPress: () => {this.onTextChange(name, false)}, style: 'cancel'},
            {text: 'OK', onPress: () => {this.onTextChange(name, true)}}
          ]
        );
      }else{
        this.onTextChange(name, false);
      }
    }

    editLocation(editedLocation){

    }

    hideLocationEditor(){
        this.props.dispatch(
          fishingEventActions.hideLocationEditor());
    }

    showLocationEditor(){
        this.props.dispatch(
          fishingEventActions.showLocationEditor());
    }

    getInputField(model, fishingEvent){
      /*let value = fishingEvent[model.id];
      let onChange = (Value)=>{
        this.onTextChange(model.id, Value);
      };
      if(['number', 'float'].indexOf(model.type) !== 1){
        let numInput = (
          <NumberTextInput
            key={model.id + "Kdkdk"}
            model={model}
            value={value}
            onChange={
              onChange.bind(this)
            }
        />);
        return (
            <View key={model.id + "Key"}>
              <InputRowWide
                model={model}
                input={numInput}
                value={value} />
            </View>
          );
      }
      if(model.type == 'dateTime' && value){
        return (
          <DateTimeEditor
            title={model.name}
            value={value}
            key={model.id + "Key"}
            onChange={
              onChange.bind(this)
            }
          />
        );
      }
      if(model.type == 'switch'){
        return(
          <Switch
            onValueChange={(value) => this.onNonFishChange(value, model.id)}
            value={value}
           />
        );
      }*/
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

    renderRow(attribute){
      if(!this.props.fishingEvent){
        return null;
      }
      let value = this.props.fishingEvent[attribute.id];
      let displayVal = value ? value.toString() : "";
      return (
        <View style={[styles.tableRow]} key={attribute.id + "editor"}>
          <View style={[styles.tableCell]}>
            <Text>{attribute.label}</Text>
          </View>
          <View style={[styles.tableCell]}>
            <TextInput clearTextOnFocus={true}
                       defaultValue=""
                       style={[styles.textInput]}
                       value={displayVal}
                       onChangeText={text => this.onTextChange(attribute.id, text)} />
          </View>
        </View>
      );
    }

    render() {
      return (
        <ScrollView>
          <View style={styles.heading}>
            <Text>Editng Shot 2</Text>
          </View>
          <View style={styles.tableWrapper}>
            <View style={[styles.tableView]}>
              {this.renderFishingEventModelInputs(false)}
            </View>
            <View style={[styles.tableView]}>
              {this.renderFishingEventModelInputs("tcer")}
            </View>
          </View>
        </ScrollView>
        );
    }
};

const select = (State, dispatch) => {
    let state = State.default;
    return {
      fishingEvent: state.fishingEvents.events[state.view.viewingFishingEventId - 1]
    };
}

const styles = {
  heading: {
    marginTop: 20,
    flexDirection:'row'
  },
  tableWrapper: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection:'row',
  },
  tableView: {
    marginTop: 20,
    flexDirection: 'column'
  },
  tableRow: {
    flexDirection: 'row',
    paddingBottom: 20,
  },
  tableCell: {
    width: 105,
  },
  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
    height: 30,
    width: 80,
    paddingLeft: 10,
  },
}


export default connect(select)(FishingEventEditor);
