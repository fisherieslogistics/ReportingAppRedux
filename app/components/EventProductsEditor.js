'use strict';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  AlertIOS,
} from 'react-native';

import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import ProductActions from '../actions/ProductActions';
import ProductModel from '../models/ProductModel';
import { modelEditorStyles, productEditorStyles } from '../styles/styles';
import ModelEditor from './common/ModelEditor';
/* eslint-disable */
import speciesCodesDesc from '../constants/speciesDesc.json';
import Icon8 from './common/Icon8';
/* eslint-enable */

const productActions = new ProductActions();
const styles = StyleSheet.create(Object.assign({}, modelEditorStyles, productEditorStyles));
const inputOrder = [
  'code',
  'weight',
];

class EventProductsEditor extends React.Component{
  constructor (props){
      super(props);
      this.state = {
        focusedAttributeId: '',
        nextInput: ''
      };
      this.onEnterPress = this.onEnterPress.bind(this);
      this.getEditorProps = this.getEditorProps.bind(this);
      this.onChange = this.onChange.bind(this);
  }

  getEditorProps(attribute, product, index) {

    const extraProps = {};
    const inputId = `${attribute.id}__edit_product_${index}_${this.props.fishingEvent.objectId}`;
    if(attribute.id === "code"){
      const usedChoices = this.props.fishingEvent.products.map(pt => pt.code);
      const choices = speciesCodesDesc.filter(
        c => (c.value === product.code) ||
             (usedChoices.indexOf(c.value) === -1));
      extraProps.choices = choices;
      extraProps.autoCapitalize = "characters";
      extraProps.maxLength = 3;

      if(usedChoices.indexOf(product.code) !== -1){
        extraProps.error = true;
      }
      if(product.code === 'OTH' || product.code === 'Other Species Weight'){
        extraProps.maxLength = 34;
        extraProps.value = 'Other Species Weight';
      }
    }
    return {
      attribute,
      extraProps,
      index,
      inputId,
    }
  }


  validateInput() {
    return true;
  }

  onChange(name, value, index) {
    if(!this.validateInput(name, value)){
      return;
    }
    switch (name) {
      case "code":
        if(!value || !this.props.fishingEvent.products.find(p => p.code === value)){
          this.props.dispatch(productActions.changeSpecies(
            this.props.fishingEvent.id, index, value, this.props.fishingEvent.objectId));
        }
        break;
      case "weight":
        this.props.dispatch(productActions.changeWeight(
          this.props.fishingEvent.id, index, value, this.props.fishingEvent.objectId));
        break;
    }
  }

  onEnterPress(attributeId, productIndex){
    //const orderOfinputs = this.props.optionalFields ? inputOrder.concat(optionalInputOrder) : inputOrder;
    const orderOfinputs = [...inputOrder];
    const index = orderOfinputs.indexOf(attributeId);
    let nextInput = '';
    const inputName = orderOfinputs[index + 1];
    const lastProduct = (productIndex === (this.props.products.length - 1));
    if(inputName){
      const nextIndex = lastProduct ? productIndex : productIndex + 1;
      nextInput = `${inputName}__${nextIndex}`;
    }this.setState({
      nextInput,
    });
  }

  renderProductEditor(product, index) {
    const onChange = (name, value) => this.onChange(name, value, index);
    return (
      <View key={`product_editor_${index}`}>
        <ModelEditor
          getEditorProps={ this.getEditorProps }
          model={ ProductModel }
          index={ index }
          noLabelRow={ (index > 0) }
          modelValues={ product }
          values={ this.props.fishingEvent }
          onChange={ onChange }
        />
        { this.renderDeleteButton(index) }
      </View>
    )
  }

  renderDeleteButton(index){
    const deleteProduct = () => this.props.deleteProduct(index);
    return (
      <TouchableOpacity
        onPress={ deleteProduct }
        style={[styles.deleteButtonWrapper, styles.deleteView]}
      >
        <Icon8
          name={"delete"}
          size={ 14 }
          color={"white"}
          />
      </TouchableOpacity>
    );
  }

  renderProductEditors(){
    const inputs = [];
    this.props.products.forEach((p, i) => {
      inputs.push(this.renderProductEditor(p, i));
    });
    return inputs;
  }

  render() {
    const spacer = { height: 50 };
    const mass = { height: 600 };
    return (
      <KeyboardAwareScrollView
        viewIsInsideTabBar
        extraHeight={ 240 }
        bouncesZoom={ false }
        alwaysBounceVertical={ false }
        keyboardShouldPersistTaps
      >
        <View
          style={spacer}
        />
        { this.renderProductEditors() }
        <View style={mass}/>
      </KeyboardAwareScrollView>
    );
  }
}

export default EventProductsEditor;
