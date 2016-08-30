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
import BlankMessage from './BlankMessage';

import {connect} from 'react-redux';
import {eventEditorStyles, inputStyle, colors, textStyles} from '../styles/styles';
import {renderCombinedEditors, getCombinedEditors } from './AttributeEditor';
import {LongButton} from './Buttons';
import Icon8 from './Icon8';

const productActions = new ProductActions();

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
        this.state = { focusedAttributeId: ''};
    }

    addProduct(){
      this.props.dispatch(productActions.addProduct(this.props.fishingEvent.id, this.props.fishingEvent.objectId));
    }

    getEditor(attribute, product, index){
      const value = product[attribute.id];
      const random = Math.random.toString();
      const inputId = attribute.id + "__event__" + this.props.fishingEvent.id + "__product__" + index + random;
      let extraProps = {fishingEvent: this.props.fishingEvent}
      if(attribute.type == 'container'){
        extraProps.choices = this.props.containerChoices;
        extraProps.name = "__product" + "_" + index + "__container";
      }
      return {
        attribute,
        value,
        onChange: (name, v) => this.onChange(name, v, index),
        extraProps: extraProps,
        inputId
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
      ProductModel.filter(pm => this.props.optionalFields ? !pm.optional : true)
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

    renderEditor(attribute, product, index){
      const getEditor = (attr) => this.getEditor(attr, product, index);
      const combinedEditors = getCombinedEditors(attribute, ProductModel, getEditor);
      if(combinedEditors.length < 4){
        let num = index + 1;
        combinedEditors.push({label: "Catch " + num, editor: null});
      }
      const editingCallback = (attributeId, focusedAttributeId) => {
        if(focusedAttributeId) {
          this.setState({ focusedAttributeId: attributeId + '__' + index });
        } else if(this.state.focusedAttributeId == attributeId + '__' + index) {
          this.setState({ focusedAttributeId: '' });
        }
      }
      const split = this.state.focusedAttributeId.split('__');
      let editting = '';
      if(split.length == 2 && split[1] == index) {
        editting = split[0];
      }
      return renderCombinedEditors(combinedEditors, styles, editingCallback, editting);
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
      return inputs.reverse();
    }

    render() {
      return (
        <View style={[styles.col, styles.fill, {alignItems: 'stretch', marginTop: 3}]}>
            {this.getBottomRow()}
          <ScrollView style={[styles.scroll]}>
            {this.getInputs()}
            <View style={{height: 550}}></View>
          </ScrollView>
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
    flex: 0.20,
    marginRight: 3
  },
  rowSection: {
    flex: 0.24
  },
  innerWrapper:{
   paddingTop: 5,
   paddingLeft: 30,
   paddingBottom: 5,
  },
  outerWrapper: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: "hidden"
  },
}

const styles = StyleSheet.create(Object.assign({}, eventEditorStyles, pStyle));
export default EventProductsEditor;
