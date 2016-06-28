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

    getEditor(attribute){
      return editor.editor(attribute,
                     this.props.fishingEvent[attribute.id],
                     this.onChange.bind(this))
    }

    renderEditors(){
      let inputs = [];
      let labels = []
      ProductModel.forEach((attribute) => {
          if(attribute.readOnly || attribute.hidden) {
              return;
          }
          inputs.push(this.renderEditor(attribute));
      });
      return inputs;
    }

    renderCombinedEditors(editors, key){
      return (
        <View style={[styles.col, styles.inputRow]} key={key}>
          <View style={[styles.row]}>
            {editors.map((e) => {
              return (
                  <View style={[styles.third]} key={e.label + key}>
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
      return this.onChangeText
    }

    render() {
      if(!this.props.fishingEvent){
        return null;
      }
      let inputs = [];
      this.props.fishingEvent.products.forEach((p) => {
        [].push.apply(inputs, this.renderEditors(p));
      });
      let inputView = (
        <View style={[styles.col, styles.fill, {alignSelf: 'flex-start'}, styles.wrapper]}>
          {inputs}
        </View>
      );
      let undoStyle = this.state.undoDeleteActive ? styles.undoActive : {};
      let undoTextStyle = this.state.undoDeleteActive ? styles.activeText : styles.inactiveText;
      return (
        <View>
          <ScrollView style={[styles.scroll]}>
            {this.props.fishingEvent.products.length ? inputView : null}
          </ScrollView>
          <View style={[styles.bottomRow]}>
            <TouchableOpacity
              style={[styles.undoDelete, undoStyle, styles.button]}
              activeOpacity={this.state.undoDeleteActive ? 1 : 0.7}>
              <Text style={[undoTextStyle]}>Undo Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.addProduct, styles.button]}>
              <Text style={[styles.activeText]}>Add Catch</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
};

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: "red",//colors.lightGray,
    alignSelf: 'stretch'
  },
  addProduct:{
    marginLeft: 10,
    backgroundColor: colors.blue
  },
  bottomRow: {
    height: 100,
    width: 716,
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
    margin: 15,
    backgroundColor: '#fff',
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


export default EventProductsEditor;
