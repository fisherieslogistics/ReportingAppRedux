'use strict';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';

import React from 'react';
import UnsoughtCatchModel from '../models/UnsoughtCatchModel';
import PlaceholderMessage from './common/PlaceholderMessage';
import {connect} from 'react-redux';
import {eventEditorStyles, inputStyles, colors, textStyles} from '../styles/styles';
import TouchableEditor from './common/TouchableEditor';
import {LongButton} from './common/Buttons';
import Icon8 from './common/Icon8';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FishingEventActions from '../actions/FishingEventActions';
const inputOrder = ['code','name','amount','notes'];
import ModelUtils from '../utils/ModelUtils';
import FocusOnDemandTextInput from './common/FocusOnDemandTextInput';
const fishingEventActions = new FishingEventActions();


const DeleteButton = (props) => {
  return (
    <TouchableOpacity onPress={() => props.onPress(props.index)} style={styles.deleteButtonWrapper}>
      <Icon8 name="delete" size={20} color="white" style={styles.deleteView} />
    </TouchableOpacity>
  );
}

class UnsoughtCatch extends React.Component{
    constructor (props){
        super(props);
        this.state = {
          focusedAttributeId: '',
          nextInput: '',
          deletes: {}
        };
        this.onEnterPress = this.onEnterPress.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.undoDeleteItem = this.undoDeleteItem.bind(this);
        this.addItem = this.addItem.bind(this);
    }

    onChange(name, value, index){
      const change = {};
      change[name] = value;
      const thisCatch = Object.assign({}, this.props.items[index], change);
      const items = [
        ...this.props.items.slice(0, index),
        thisCatch,
        ...this.props.items.slice(index + 1)
      ];
      this.props.dispatch(fishingEventActions.addUnsoughtCatch(this.props.fishingEvent.id,
                                                               items,
                                                               this.props.unsoughtType,
                                                               this.props.formType));
    }

    getEditor(attribute, item, index, focus, onFocus, onBlur){
      const value = item[attribute.id];
      const inputId = this.getInputId(attribute.id, index);
      const onKeyPress = (evt) => evt.nativeEvent.key === 'Enter' && this.onEnterPress(attribute.id, index);
      return (
        <FocusOnDemandTextInput
          key={ inputId + '_key_' + item.objectId }
          selectTextOnFocus={true}
          autoCorrect={false}
          autoCapitalize={'none'}
          value={ value }
          style={ inputStyles.textInput }
          onFocus={ () => this.onInputFocus(attribute.id, index) }
          onChangeText={ (v) => this.onChange(attribute.id, v, index) }
          focus={ focus }
          onKeyPress={ onKeyPress }
         />
      );
    }

    renderEditors(item, index){
      let inputs = [];
      UnsoughtCatchModel.forEach((attribute) => {
        inputs.push(this.renderEditor(attribute, item, index));
      });
      return (
        <View style={[styles.innerWrapper, styles.outerWrapper]} key={this.props.unsoughtType + item.objectId + '_' + index}>
          {inputs}
          <DeleteButton
            onPress={this.deleteItem}
            index={index}
          />
        </View>
      );
    }

    onEnterPress(attributeId, itemIndex){
      const index = inputOrder.indexOf(attributeId);

      if(index === -1){
        this.setState({
          nextInput: '',
        });
        return;
      }

      const isLastInput = (index === (inputOrder.length - 1));
      const input = isLastInput ? inputOrder[0] : inputOrder[index + 1];

      if(isLastInput){
        this.setState({
          nextInput: '',
        });
        return;
      };

      this.setState({
        nextInput: this.getInputId(input, itemIndex + 1),
      });

    }

    getInputId(name, index) {
      return `${name}__${index}__${this.props.unsoughtType}`;
    }

    onInputFocus(attributeId, index){
      const id = this.getInputId(attributeId, index);
      if(id === this.state.nextInput){
        this.setState({ focusedAttributeId: ''});
      } else {
        this.setState({ focusedAttributeId: id });
      }
    }

    renderEditor(attribute, item, index){
      const inputId = this.getInputId(attribute.id, index);

      const focusedNext = (inputId === this.state.nextInput);
      const focusedNow = (inputId === this.state.focusedAttributeId);
      const input = this.getEditor(attribute, item, index, focusedNow || focusedNext);
      return (
        <TouchableEditor
          key={ attribute.id + inputId + item.objectId }
          styles={ styles }
          wrapperStyle={ [{flex: 1}] }
          onPress={ () => this.onInputFocus(attribute.id, index) }
          inputId={ inputId }
          input={ input }
          label={ attribute.label }
        />
      );
    }

    getDetailWidth(){
      switch (this.props.orientation) {
        case 'PORTRAIT':
        case 'PORTRAITUPSIDEDOWN':
          return 534;
        case 'LANDSCAPE':
        case 'LANDSCAPEUPSIDEDOWN':
          return 714;
      }
    }

    deleteItem(index){
      var items = [...this.props.items];
      const deletes = Object.assign({}, this.state.deletes);
      const item = Object.assign({}, items.splice(index, 1)[0], {index: index});
      deletes[this.props.fishingEvent.id] = [...(deletes[this.props.fishingEvent.id] || []), item];
      this.setState({
        deletes: deletes,
      });
      this.props.dispatch(fishingEventActions.addUnsoughtCatch(this.props.fishingEvent.id,
                                                               items,
                                                               this.props.unsoughtType,
                                                               this.props.formType));
    }

    undoDeleteItem(){
      const deleted = [...this.state.deletes[this.props.fishingEvent.id]].pop();
      const index = 0 + deleted.index;

      delete deleted.index;
      const items = [
        ...this.props.items.slice(0, index),
        deleted,
        ...this.props.items.slice(index + 1)
      ];

      this.props.dispatch(fishingEventActions.addUnsoughtCatch(this.props.fishingEvent.id,
                                                               items,
                                                               this.props.unsoughtType,
                                                               this.props.formType));
    }

    addItem(){
      const newCatch = ModelUtils.blankModel(UnsoughtCatchModel);
      const deletes = Object.assign({}, this.state.deletes);
      delete deletes[this.props.fishingEvent.id];
      this.setState({
        deletes: deletes,
      })
      this.props.dispatch(fishingEventActions.addUnsoughtCatch(this.props.fishingEvent.id,
                                                               this.props.items.concat([newCatch]),
                                                               this.props.unsoughtType,
                                                               this.props.formType));
    }

    getBottomRow(){

      return (
        <View style={[styles.bottomRow]}>
          <View style={styles.buttonWrapper}>
            <LongButton
               bgColor={colors.pink}
               text={"Undo"}
               onPress={this.undoDeleteItem}
               disabled={!(this.state.deletes[this.props.fishingEvent.id] || []).length}
            />
            <LongButton
              bgColor={colors.blue}
              text={"Add " + this.props.unsoughtType.slice(0, this.props.unsoughtType.length - 1) }
              disabled={false}
              onPress={this.addItem}
            />
          </View>
        </View>
      )
    }

    getInputs(){
      if(!this.props.items.length){
        return this.props.renderMessage("No Catches");
      }
      let inputs = [];
      this.props.items.forEach((p, i) => {
        inputs.push(this.renderEditors(p, i));
      });
      return inputs;
    }

    render() {
      return (
        <View style={[styles.col, styles.fill, {alignItems: 'stretch', marginTop: 3}]}>
            {this.getBottomRow()}
          <KeyboardAwareScrollView style={[styles.scroll]} viewIsInsideTabBar={true} extraHeight={ 230 } alwaysBounceVertical={false} bouncesZoom={false}>
            {this.getInputs()}
            <View style={{height: 550}}></View>
          </KeyboardAwareScrollView>
        </View>
      );
    }
};

const pStyle = {
  scroll: {
    backgroundColor: colors.lightGray
  },
  addItem:{
    marginLeft: 10,
    backgroundColor: colors.blue
  },
  bottomRow: {
    height: 40,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    //backgroundColor: colors.white,
    //borderTopWidth: 1,
    //borderColor: colors.midGray
  },
  buttonWrapper:{
    width: 360,
    flexDirection: 'row',
    justifyContent: "space-between",
  },
  undoDelete:{
    borderWidth: 1,
    borderColor: colors.midGray
  },
  deleteButtonWrapper:{
    position: 'absolute',
    right: 8,
    top: 8
  },
  deleteView: {
    borderRadius: 10,
    width: 20,
    height: 20,
    backgroundColor: colors.red,
  },
  labelRow: {
    flex: 0.50,
    marginRight: 3
  },
  innerWrapper:{
   paddingTop: 2,
   paddingLeft: 20,
   paddingBottom: 5,
  },
  outerWrapper: {
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: "hidden"
  },
  labelText: {
    fontSize: 16,
    color: colors.blue,
  },

}

const styles = StyleSheet.create(Object.assign({}, eventEditorStyles, pStyle));
export { DeleteButton }
export default UnsoughtCatch;
