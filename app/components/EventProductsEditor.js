'use strict';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import React from 'react';
import ProductActions from '../actions/ProductActions';
import ProductModel from '../models/ProductModel';

import {connect} from 'react-redux';
import {eventEditorStyles, inputStyle, colors, textStyles} from '../styles/styles';
import {renderCombinedEditors, getCombinedEditors, AttributeEditor} from './AttributeEditor';

const productActions = new ProductActions();

class EventProductsEditor extends React.Component{
    constructor (props){
        super(props);
        this.state = {
          undoDeleteActive: false
        }
    }

    addProduct(){
      this.props.dispatch(productActions.addProduct(this.props.fishingEvent.id));
    }

    getEditor(attribute, product, index){
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
        <View style={[styles.fill, styles.wrapper]} key={"product" + index + Math.random.toString()}>
          {inputs}
        </View>
      );
    }

    renderEditor(attribute, product, index){
      const getEditor = (attr) => this.getEditor(attr, product, index);
      const combinedEditors = getCombinedEditors(attribute, ProductModel, getEditor);
      if(combinedEditors.length < 4){
        combinedEditors.push({label: "", editor: null});
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

    render() {
      if(!this.props.fishingEvent){
        return null;
      }
      let inputs = [];
      this.props.fishingEvent.products.forEach((p, i) => {
        inputs.push(this.renderEditors(p, i));
      });
      let undoStyle = this.state.undoDeleteActive ? styles.undoActive : {};
      let undoTextStyle = this.state.undoDeleteActive ? textStyles.active : styles.inactiveText;

      let bottomRow = (
        <View style={[styles.bottomRow, {width: this.getDetailWidth()}]}>
          <TouchableOpacity
            style={[styles.undoDelete, undoStyle, styles.button]}
            activeOpacity={this.state.undoDeleteActive ? 1 : 0.7}>
            <Text style={[textStyles.font,undoTextStyle]}>Undo Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addProduct, styles.button]}
            onPress={this.addProduct.bind(this)}>
            <Text style={[textStyles.font,textStyles.active]}>Add Catch</Text>
          </TouchableOpacity>
        </View>
    );

      return (
        <View>
          <ScrollView style={[styles.scroll]}>
            {this.props.fishingEvent.products.length ? inputs.reverse() : null}
          </ScrollView>
          {bottomRow}
        </View>
      );
    }
};

const productEditorStyle = {
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
  },
  button: {
    width: 150,
    height: 30,
    paddingTop: 6,
    paddingLeft: 30
  },
  undoDelete:{
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.midGray
  },
  activeText: {
    color: colors.white
  },
  inactiveText: {
    color: colors.midGray
  },
  labelRow: {
    flex: 0.20,
    marginRight: 3
  },
  rowSection: {
    flex: 0.24
  }
}

const styles = StyleSheet.create(Object.assign({}, eventEditorStyles, productEditorStyle));


const select = (State, dispatch) => {
    let state = State.default;
    return {
      width: state.view.width,
      uiOrientation: state.view.uiOrientation,
    };
}

export default connect(select)(EventProductsEditor);
