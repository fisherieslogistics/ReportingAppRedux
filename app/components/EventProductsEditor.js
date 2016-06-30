'use strict';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  Switch,
  AlertIOS,
  Dimensions,
  TextInput,
} from 'react-native';

import React from 'react';
import {connect} from 'react-redux';
import ProductActions from '../actions/ProductActions';
import inputStyle from '../styles/inputStyle';
import colors from '../styles/colors';
import ProductModel from '../models/ProductModel';
import Editor from '../utils/Editor';
const editor = new Editor();
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

    getEditor(attribute, value, index){
      let inputId = attribute.id + "__event__" + this.props.fishingEvent.id + "__product__" + index;
      return editor.editor(attribute,
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

    renderCombinedEditors(editors, key){
      return (
          <View style={[styles.col, styles.inputRow]} key={"combined" + key +  Math.random().toString()}>
            <View style={[styles.row]}>
              {editors.map((e) => {
                return (
                    <View style={[styles.quarter]} key={e.label +  Math.random().toString()}>
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

    renderEditor(attribute, product, index){
      if(attribute.editorDisplay && attribute.editorDisplay.hideNull){
        return null;
      }
      if(attribute.editorDisplay && attribute.editorDisplay.editor === this.props.editorType){
        switch (attribute.editorDisplay.type) {
          case "combined":
            let editors = [{label: attribute.label, editor: this.getEditor(attribute, product[attribute.id], index)}];
            let addedEditors = attribute.editorDisplay.siblings.map((s) => {
                let attr = ProductModel.find((a) => {
                             return a.id === s;
                            });

                return {label: attr.label, editor: this.getEditor(attr, product[attr.id], index)};
            });
            let allEditors = editors.concat(addedEditors);
            if(allEditors.length < 4){
              allEditors.push({label: "", editor: null});
            }
            return this.renderCombinedEditors(allEditors);
          default:
        }
      }
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
      console.log(this.getDetailWidth(), this.props.uiOrientation);
      if(!this.props.fishingEvent){
        return null;
      }
      let inputs = [];
      this.props.fishingEvent.products.forEach((p, i) => {
        inputs.push(this.renderEditors(p, i));
      });
      let undoStyle = this.state.undoDeleteActive ? styles.undoActive : {};
      let undoTextStyle = this.state.undoDeleteActive ? styles.activeText : styles.inactiveText;
      return (
        <View>
          <ScrollView style={[styles.scroll]}>
            {this.props.fishingEvent.products.length ? inputs.reverse() : null}
          </ScrollView>
          <View style={[styles.bottomRow, {width: this.getDetailWidth()}]}>
            <TouchableOpacity
              style={[styles.undoDelete, undoStyle, styles.button]}
              activeOpacity={this.state.undoDeleteActive ? 1 : 0.7}>
              <Text style={[undoTextStyle]}>Undo Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.addProduct, styles.button]}
              onPress={this.addProduct.bind(this)}>
              <Text style={[styles.activeText]}>Add Catch</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
};

const styles = StyleSheet.create({
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
  wrapper:{
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingTop: 2,
    paddingLeft: 30,
    paddingBottom: 8,
  },
  col:{
    flexDirection: 'column',
  },
  row:{
    flexDirection: 'row',
  },
  inputRow: {
    paddingTop: 5,
    height: 50,
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
    flex: 0.25,
  },
  labelText: {
    color: colors.blue
  },
  quarter: {
    flex: 0.25
  }
});


const select = (State, dispatch) => {
    let state = State.default;
    return {
      width: state.view.width,
      uiOrientation: state.view.uiOrientation,
    };
}

export default connect(select)(EventProductsEditor);
