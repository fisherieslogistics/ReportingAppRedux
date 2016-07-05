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
import {renderCombinedEditors, getCombinedEditors, AttributeEditor} from './AttributeEditor';
import {cancelWhite} from '../icons/PngIcon';
import {LongButton} from './Buttons';
import {addToKeyStore} from '../actions/SyncActions';

const productActions = new ProductActions();

const DeleteButton = (props) => {
  return (
    <TouchableOpacity onPress={() => props.onPress(props.index)} style={styles.deleteButtonWrapper}>
      <View style={ styles.deleteView }>
        <Image source={cancelWhite} style={styles.deleteView}/>
      </View>
    </TouchableOpacity>
  );
}

class EventProductsEditor extends React.Component{
    constructor (props){
        super(props);
    }

    addProduct(){
      this.props.dispatch(productActions.addProduct(this.props.fishingEvent.id));
    }

    getEditor(attribute, product, index){
      if(product == null){
        debugger;
      }
      const value = product[attribute.id];
      const inputId = attribute.id + "__event__" + this.props.fishingEvent.id + "__product__" + index;
      return AttributeEditor(attribute,
                     value,
                     (name, v) => this.onChange(name, v, index),
                     {fishingEvent: this.props.fishingEvent},
                     inputId);
    }

    onChange(name, value, catchId){
      switch (name) {
        case "code":
          this.props.dispatch(productActions.changeSpecies(this.props.fishingEvent.id, catchId, value));
          break;
        case "weight":
          this.props.dispatch(productActions.changeWeight(this.props.fishingEvent.id, catchId, value));
          break;
        default:
          this.props.dispatch(productActions.changeCustom(name, this.props.fishingEvent.id, catchId, value));
          break;
      }
      this.props.dispatch(addToKeyStore("fishingEvents", this.props.fishingEvent.guid));
    }

    renderEditors(product, index){
      let inputs = [];
      ProductModel.forEach((attribute) => {
          if(!attribute.editorDisplay) {
              return;
          }
          inputs.push(this.renderEditor(attribute, product, index));
      });
      return (
        <View style={[styles.innerWrapper, styles.outerWrapper]} key={"product" + index + Math.random.toString()}>
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
      return renderCombinedEditors(combinedEditors, styles);
    }

    getDetailWidth(){
      switch (this.props.uiOrientation) {
        case 'PORTRAIT':
        case 'PORTRAITUPSIDEDOWN':
          return 534;
        case 'LANDSCAPE':
        case 'LANDSCAPEUPSIDEDOWN':
          return 714;
      }
    }

    deleteProduct(index){
      this.props.dispatch(productActions.deleteProduct(index, this.props.fishingEvent.id));
    }

    undoDeleteProduct(){
      if(this.props.deletedProducts.length){
        this.props.dispatch(productActions.undoDeleteProduct(this.props.fishingEvent.id));
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
        <View style={[styles.col, styles.fill, {alignItems: 'stretch'}]}>
          <ScrollView style={[styles.scroll]}>
            {this.getInputs()}
          </ScrollView>
            {this.getBottomRow()}
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
    height: 100,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: colors.midGray
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
    opacity: 0.6
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
