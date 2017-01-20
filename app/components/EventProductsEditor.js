'use strict';
import {
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';

import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import ProductActions from '../actions/ProductActions';
import FishingEventActions from '../actions/FishingEventActions';
import ProductModel from '../models/ProductModel';
import OtherSpeciesWeightModel from '../models/OtherSpeciesWeightModel';
import { colors, modelEditorStyles, productEditorStyles } from '../styles/styles';
import ModelEditor from './common/ModelEditor';
/* eslint-disable */
import speciesCodesDesc from '../constants/speciesDesc.json';
import Icon8 from './common/Icon8';
/* eslint-enable */

const productActions = new ProductActions();
const fishingEventActions = new FishingEventActions();
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
      this.onChangeProduct = this.onChangeProduct.bind(this);
      this.onChangeOtherSpeciesWeight = this.onChangeOtherSpeciesWeight.bind(this);
  }

  getEditorProps(attribute, product, index) {

    const extraProps = {};
    const inputId = `${attribute.id}__edit_product_${index}_${this.props.fishingEvent.objectId}`;
    if(attribute.id === "code"){
      const usedChoices = this.props.fishingEvent.products.map(pt => pt.code);
      extraProps.choices = speciesCodesDesc;
      extraProps.autoCapitalize = "characters";
      extraProps.maxLength = 3;
      if(usedChoices.indexOf(product.code) !== -1){
        extraProps.error = true;
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

  onChangeProduct(name, value, index) {
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

  onChangeOtherSpeciesWeight(name, value) {
    if(!this.validateInput(name, value)) {
      return;
    }
    if (name === 'weight') {
      this.props.dispatch(fishingEventActions.setFishingEventValue(
        this.props.fishingEvent.id, 'otherSpeciesWeight', value));
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
    const onChange = (name, value) => this.onChangeProduct(name, value, index);
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

  renderOtherSpeciesEditor() {
    const onChange = (name, value) => this.onChangeOtherSpeciesWeight(value);
    const getEditorProps = () => ({});
    return (
      <View
        key={`other_species_weight_editor`}
      >
        <ModelEditor
          getEditorProps={ getEditorProps }
          iamTheOne={ true }
          model={ OtherSpeciesWeightModel }
          modelValues={ this.props.fishingEvent }
          index={ 0 }
          onChange={ onChange }
        />
      </View>
    )
  }

  renderDeleteButton(index){
    const deleteProduct = () => this.props.deleteProduct(index);
    const delStyle = [styles.deleteButtonWrapper]
    return (
      <TouchableOpacity
        onPress={ deleteProduct }
        style={ delStyle }
      >
        <Icon8
          name={ 'delete' }
          size={ 20 }
          color={ colors.red }
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
        { this.renderOtherSpeciesEditor() }
        <View style={mass}/>
      </KeyboardAwareScrollView>
    );
  }
}

export default EventProductsEditor;
