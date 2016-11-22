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
import ProductActions from '../actions/ProductActions';
import ProductModel from '../models/ProductModel';
import PlaceholderMessage from './common/PlaceholderMessage';

import {connect} from 'react-redux';
import {eventEditorStyles, inputStyle, colors, textStyles} from '../styles/styles';
import {renderCombinedEditors, getCombinedEditors } from './common/AttributeEditor';
import {LongButton} from './common/Buttons';
import Icon8 from './common/Icon8';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const productActions = new ProductActions();

const inputOrder = [
  'code',
  'numberOfContainers',
  'weight',
];

const optionalInputOrder = [
  'state',
  'containerType',
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

    onChange(name, value, catchId){
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
      ProductModel.filter(pm => this.props.optionalFields || !pm.optional)
                  .forEach((attribute) => {
          if(!attribute.editorDisplay) {
              return;
          }
          inputs.push(this.renderEditor(attribute, product, index));
      });
      return (
        <View style={[styles.innerWrapper, styles.outerWrapper]} key={"product" + product.objectId}>
          {inputs}
          <DeleteButton
            onPress={this.deleteProduct.bind(this)}
            index={index}
          />
        </View>
      );
    }

    onEnterPress(attributeId, productIndex){
      const orderOfinputs = this.props.optionalFields ? inputOrder.concat(optionalInputOrder) : inputOrder;
      const index = orderOfinputs.indexOf(attributeId);
      if(index === -1) {
        this.setState({
          nextInput: '',
        });
        return;
      }

      const isLastInput = (index === (orderOfinputs.length - 1));
      const input = isLastInput ? orderOfinputs[0] : orderOfinputs[index + 1];

      if((productIndex === (this.props.products.length - 1)) && isLastInput){
        this.addProduct();
        this.setState({
          nextInput: input + '__' + (productIndex + 1),
        });
        return;
      };

      this.setState({
        nextInput: input + '__' + (isLastInput ? (productIndex + 1) : productIndex),
      });
    }

    renderEditor(attribute, product, index){
      const getEditor = (attr) => this.getEditor(attr, product, index);
      const combinedEditors = getCombinedEditors(attribute, ProductModel, getEditor);
      if(combinedEditors.length < 4){
        let num = index + 1;
        combinedEditors.push({label: "Catch " + num, editor: null});
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
               onPress={this.undoDeleteProduct.bind(this)}
               disabled={!this.props.deletedProducts.length}
            />
            <LongButton
              bgColor={colors.blue}
              text={"Add Catch"}
              disabled={false}
              onPress={this.addProduct.bind(this)}
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
