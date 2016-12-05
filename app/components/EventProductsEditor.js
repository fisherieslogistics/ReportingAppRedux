'use strict';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  AlertIOS,
} from 'react-native';

import React from 'react';
import ProductActions from '../actions/ProductActions';
import ProductModel from '../models/ProductModel';
import PlaceholderMessage from './common/PlaceholderMessage';

import {connect} from 'react-redux';
import {eventEditorStyles, inputStyle, colors, textStyles} from '../styles/styles';
import {renderCombinedEditors, getCombinedEditors } from './common/AttributeEditor';
import {LongButton} from './common/Buttons';
import Icon8 from './common/Icon8';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import speciesCodesDesc from '../constants/speciesDesc.json';

const productActions = new ProductActions();

const inputOrder = [
  'code',
  'weight',
];

const optionalInputOrder = [
  'state',
  'containerType',
  'numberOfContainers',
  'grade',
  'treatment',
];

const DeleteButton = (props) => {
  return (
    <TouchableOpacity onPress={() => props.onPress(props.index)} style={styles.deleteButtonWrapper}>
      <Icon8 name="delete" size={20} color="white" style={styles.deleteView} />
    </TouchableOpacity>
  );
}

class EventProductsEditor extends React.Component{
    constructor (props){
        super(props);
        this.state = {
          focusedAttributeId: '',
          nextInput: ''
        };
        this.onEnterPress = this.onEnterPress.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.undoDeleteProduct = this.undoDeleteProduct.bind(this);
        this.addProduct = this.addProduct.bind(this);
    }

    addProduct(){
      this.props.dispatch(productActions.addProduct(this.props.fishingEvent.id, this.props.fishingEvent.objectId));
    }

    getEditor(attribute, product, index){
      const value = product[attribute.id];
      const inputId = attribute.id + "__event__" + this.props.fishingEvent.id + "__product__" + index;
      let extraProps = {fishingEvent: this.props.fishingEvent}
      if(attribute.type == 'container'){
        extraProps.choices = this.props.containerChoices;
        extraProps.name = "__product" + "__" + index + "__container";
        extraProps.attributeId = attribute.id;
      }
      if(attribute.id === "code"){
        extraProps.choices = speciesCodesDesc;
        extraProps.autoCapitalize = "characters";
        extraProps.maxLength = 3;
      }
      let onChange = (name, v) => this.onChange(name, v, index);
      if(value === 'OTH'){
        extraProps.maxLength = 34;
        extraProps.value = 'Other Species Weight';
        onChange = (name, v) => {
          if(v.length === 3) this.onChange(name, v, index);
        };
      }

      const enterPressed = (nativeEvent, value) => {
        if(attribute.id === 'code'){
          onChange('code', value);
        }
        this.onEnterPress(attribute.id, index)
      };
      return {
        attribute,
        value: value,
        onChange: onChange,
        extraProps: extraProps,
        inputId,
        onEnterPress: enterPressed,
      }
    }

    validateCode(code) {
      if(!code.length < 3) {
        return true;
      }
      if(this.props.fishingEvent.products.find(p => p.code === code)){
        AlertIOS.alert("Only one catch per species code is allowed.");
        return false;
      }
      return true;
    }

    validateInput(name, value) {
      switch (name) {
        case "code":
          return this.validateCode(value);
      }
      return true;
    }

    onChange(name, value, catchId){
      if(!this.validateInput(name, value)){
        return;
      }
      switch (name) {
        case "code":
          this.props.dispatch(productActions.changeSpecies(this.props.fishingEvent.id, catchId, value, this.props.fishingEvent.objectId));
          break;
        case "weight":
          this.props.dispatch(productActions.changeWeight(this.props.fishingEvent.id, catchId, value, this.props.fishingEvent.objectId));
          break;
        default:
          this.props.dispatch(productActions.changeCustom(name, this.props.fishingEvent.id, catchId, value, this.props.fishingEvent.objectId));
          break;
      }
    }

    renderEditors(product, index){
      let inputs = [];
      ProductModel.filter(pm => !this.props.optionalFields || !pm.optional)
                  .forEach((attribute) => {
          if(!attribute.editorDisplay) {
              return;
          }
          inputs.push(this.renderEditor(attribute, product, index));
      });
      return (
        <View key={"product" + product.objectId}>
          {inputs}
          <DeleteButton
            onPress={this.deleteProduct}
            index={index}
          />
        </View>
      );
    }

    onEnterPress(attributeId, productIndex){
      //const orderOfinputs = this.props.optionalFields ? inputOrder.concat(optionalInputOrder) : inputOrder;
      let orderOfinputs = [...inputOrder];
      const index = orderOfinputs.indexOf(attributeId);
      let nextInput = '';
      let inputName = orderOfinputs[index + 1];
      let lastProduct = (productIndex === (this.props.products.length - 1));
      console.log("beast", inputName, attributeId, productIndex);
      if(inputName){
        console.log("not adding", `${inputName}__${productIndex}`);
        nextInput = `${inputName}__${productIndex}`;
      } else if (lastProduct) {
        this.addProduct();
        console.log(`${orderOfinputs[0]}__${productIndex + 1}`);
        nextInput = `${orderOfinputs[0]}__${productIndex + 1}`;
      } else {
        console.log(`${orderOfinputs[0]}__${productIndex + 1}`);
        nextInput = `${orderOfinputs[0]}__${productIndex + 1}`;
      }
      this.setState({
        nextInput,
      });
    }

    renderEditor(attribute, product, index, productIndex){
      if(index > 0) {
        delete attribute.label;
      }
      const getEditor = (attr) => this.getEditor(attr, product, index);
      const combinedEditors = getCombinedEditors(attribute, ProductModel, getEditor);
      if(combinedEditors.length < 4){
        let num = index + 1;
        //combinedEditors.push({label: "Catch " + num, editor: null});
      }
      const editingCallback = (attributeId) => {
        const attrId = attributeId + '__' + index;
        if(attrId === this.state.nextInput){
          this.setState({ nextInput: ''});
        }
        if(this.state.focusedAttributeId == attrId) {
          this.setState({ focusedAttributeId: '' });
        } else {
          this.setState({ focusedAttributeId: attrId });
        }
      }

      let nextInput = this.state.nextInput;
      let focusedId = this.state.focusedAttributeId;

      return renderCombinedEditors(
        combinedEditors, styles, editingCallback, nextInput || focusedId, index);
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

    deleteProduct(index){
      this.props.dispatch(productActions.deleteProduct(index, this.props.fishingEvent.id, this.props.fishingEvent.objectId));
    }

    undoDeleteProduct(){
      if(this.props.deletedProducts.length){
        this.props.dispatch(productActions.undoDeleteProduct(this.props.fishingEvent.id, this.props.fishingEvent.objectId));
      }
    }

    getBottomRow(){
      return (
        <View style={[styles.bottomRow]}>
          <View style={styles.buttonWrapper}>
            <LongButton
               bgColor={colors.pink}
               text={"Undo"}
               onPress={this.undoDeleteProduct}
               disabled={!this.props.deletedProducts.length}
            />
            <LongButton
              bgColor={colors.blue}
              text={"Add Catch"}
              disabled={false}
              onPress={this.addProduct}
            />
          </View>
        </View>
      )
    }

    getInputs(){
      if(!this.props.products.length){
        return this.props.renderMessage("No Catches");
      }
      let inputs = [];
      this.props.products.forEach((p, i) => {
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
  addProduct:{
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
export default EventProductsEditor;
