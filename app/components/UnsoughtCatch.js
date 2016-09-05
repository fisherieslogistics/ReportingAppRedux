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
import {eventEditorStyles, inputStyle, colors, textStyles} from '../styles/styles';
import { SingleEditor } from './common/AttributeEditor';
import {LongButton} from './common/Buttons';
import Icon8 from './common/Icon8';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FishingEventActions from '../actions/FishingEventActions';
const inputOrder = ['code','name','amount','notes'];
import ModelUtils from '../utils/ModelUtils';
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

    getEditor(attribute, product, index){
      const value = product[attribute.id];
      const inputId = this.getInputId(attribute, product, index)
      let extraProps = {fishingEvent: this.props.fishingEvent}
      const enterPressed = (attrId) => { this.onEnterPress(attrId, index) };
      return {
        attribute,
        value,
        onChange: (name, v) => this.onChange(name, v, index),
        extraProps: extraProps,
        inputId,
        onEnterPress: enterPressed,
      }
    }

    renderEditors(product, index){
      let inputs = [];
      UnsoughtCatchModel.forEach((attribute) => {
          inputs.push(this.renderEditor(attribute, product, index));
      });
      return (
        <View style={[styles.innerWrapper, styles.outerWrapper]} key={this.props.unsoughtType + product.objectId + '_' + index}>
          {inputs}
          <DeleteButton
            onPress={this.deleteItem.bind(this)}
            index={index}
          />
        </View>
      );
    }

    onEnterPress(attribute, productIndex){
      console.log(attribute, productIndex);
      const index = inputOrder.indexOf(attribute.id);
      console.log(attribute.id, productIndex, "ON ENTER", index, "INDEX");
      if(index === -1){
        this.setState({
          nextInput: '',
        });
        return;
      }

      if (index <= UnsoughtCatchModel.length){
        this.setState({
          nextInput: this.getInputId(attribute, productIndex),
        });
        return;
      }
    }

    getInputId(attribute, index) {
      return `${attribute.id} ${index} ${this.props.unsoughtType} ${this.props.fishingEvent.id}`;
    }

    renderEditor(attribute, product, index){

      const attrId = this.getInputId(attribute, index);
      //console.log(attrId);

      const editingCallback = (attributeId, isFocused) => {
        if(attrId === this.state.nextInput){
          this.setState({ focusedAttributeId: '', nextInput: ''});
        } else if(isFocused) {
          this.setState({ focusedAttributeId: attrId });
        } else if(this.state.focusedAttributeId == attrId) {
          this.setState({ focusedAttributeId: '' });
        }
      }

      let nextInput = this.state.nextInput;
      let focusedId = this.state.focusedAttributeId;

      console.log("next", nextInput, "focused", focusedId);

      return (
        <SingleEditor
          attribute={attribute}
          styles={styles}
          getEditor={ () => this.getEditor(attribute, product, index) }
          value={ product[attribute.id] }
          focusedAttributeId={ focusedId }
          editingCallback={editingCallback}
          onEnterPress={ () => this.onEnterPress(attribute, index) }
          isTopRow={ index === 1 }
          key={ attrId + '__' + product.objectId }
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
               onPress={this.undoDeleteItem.bind(this)}
               disabled={!(this.state.deletes[this.props.fishingEvent.id] || []).length}
            />
            <LongButton
              bgColor={colors.blue}
              text={"Add " + this.props.unsoughtType.slice(0, this.props.unsoughtType.length - 1) }
              disabled={false}
              onPress={this.addItem.bind(this)}
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
  rowSection: {
    flex: 0.24
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
