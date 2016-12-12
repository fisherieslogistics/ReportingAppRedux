'use strict';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ListView,

  Image,
  TouchableOpacity
} from 'react-native';

import React from 'react';
import RNViewShot from "react-native-view-shot";

import AsyncStorage from 'AsyncStorage';
import FormsList from './FormsList';
import MasterDetailView from './layout/MasterDetailView';
import ModelUtils from '../utils/ModelUtils';
import SignatureView from './SignatureView';

import FormActions from '../actions/FormActions';
const formActions = new FormActions();

import {connect} from 'react-redux';
import {MasterToolbar, DetailToolbar} from './layout/Toolbar';
import {colors, formsStyles, textStyles, shadowStyles } from '../styles/styles';
import {getFormModelByTypeCode, renderForm, createForms} from '../utils/FormUtils';

const styles = StyleSheet.create(formsStyles);

class FormView extends React.Component {
  constructor(props){ //icon ans sign form fix it
    super(props);
    this.state = {
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
      showSignature: false,
      showSignatureWarning: false,
      forms: props.forms,
      selectedIndex: 0
    };
    this._onSaveEvent = this._onSaveEvent.bind(this);
    this.sendFormImage = this.sendFormImage.bind(this);
  }

  componentWillReceiveProps(props){
    this.setState({
      forms: props.forms
    })
  }

  toggleSignature(canSignOne){
    if(!canSignOne) {
      return;
    }
    this.setState({
      showSignatureWarning: true
    });
  }

  saveSign() {
    this.refs.sign.saveImage();
  }

  resetSign() {
    this.refs.sign.resetImage();
  }

  sendFormImage() {
    console.log('hellooooo')
    RNViewShot.takeSnapshot(this.refs.renderedForm, {
      format: "png",
      quality: 1,
      result: "base64",
    })
    .then(
      uri => console.log("Image saved to", uri),
      error => console.error("Oops, snapshot failed", error)
    );
  }

  _onSaveEvent(result) {
    //result.encoded - for the base64 encoded png
    //result.pathName - for the file path name
    const form = this.props.viewingForm;
    this.props.dispatch(formActions.signForm(this.props.viewingForm, result.encoded));
    this.setState({
      showSignature: false,
    });
    //TODO something better when using events
    setTimeout(() => {
      const forms = createForms(this.props.fishingEvents, this.props.formType);
      this.setState({
        forms
      });
     this.props.dispatch(formActions.setViewingForm(forms[form.id - 1]));
     }, 300);
 }

  renderFormsListView(){
    return (
      <FormsList
        dispatch={this.props.dispatch}
        forms={this.state.ds.cloneWithRows([...this.state.forms].reverse())}
        viewingForm={this.props.viewingForm}
      />
    );
  }

  renderRepeating(obj, parts, k, allText, meta, eventIndex){
    let key  = "" + k;
    let items = obj[k];
    if(meta.prep){
      items = meta.prep(obj[k]);
      key += "__prepped";
      obj[key] = items;
    }
    items.forEach((v, i) => {
      this.renderMultiple(obj, parts, key, allText, eventIndex, i);
    });
  }

  renderMultiple(obj, parts, key, allText, eventIndex, itemIndex){
    parts.forEach((p) => {
      const val = p.resolve(obj, itemIndex, key);
      allText.push(this.renderText(val, p, eventIndex, itemIndex, key));
    });
  }

  resolveValue(resolve, obj){
    let val = "";
    try {
      val = resolve(obj);
    } catch (e) {
    }
    return val;
  }

  getValue(obj, meta, k){
    if(!meta.resolve){
      return obj[k];
    }
    return this.resolveValue(meta.resolve, meta.resolveFrom ? this.props[meta.resolveFrom] : obj);
  }

  renderValue(obj, meta, k, allText, eventIndex){
    if(meta.repeating && obj[k].length) {
      this.renderRepeating(obj, meta.parts, k, allText, meta, eventIndex);
    }
    else if(meta.multiple && obj[k]){
      this.renderMultiple(obj, meta.parts, k, allText, eventIndex);
    }
    else{
      allText.push(this.renderText(this.getValue(obj, meta, k), meta, eventIndex, 0, k));
    }
  }

  renderObj(obj, meta, eventIndex){
    const allText = [];
    Object.keys(meta).forEach((k) => {
      this.renderValue(obj, meta[k], k, allText, eventIndex);
    });
    return allText;
  }

  renderText(val, meta, xIndex=0, yIndex=0, key){
    const _key = `${val} ${xIndex} ${yIndex} ${key} ${meta.x} ${meta.y}`;
    const xy = {left: meta.x * 0.657, top: meta.y * 0.658};
    if(meta.ymultiple){
      xy.top += (meta.ymultiple * yIndex);
    }
    xy.left += (this.props.formModelMeta.xMultiplier * xIndex);
    return (
      <View style={[styles.textWrapper, xy, meta.viewStyle || {}]} key={_key}>
        <Text style={[textStyles.font,styles.text, this.props.formModelMeta.textStyle || {}, meta.textStyle || {} ]}>{val}</Text>
      </View>);
  }

  renderFishingEvents(allText, form){
    const fe = form.fishingEvents;
    fe.forEach((f, i) => {
      allText = allText.concat(this.renderObj(f, this.props.formModelMeta.printMapping.fishingEvents, i));
    });
    return allText;
  }
  renderForm(form){
    return this.renderObj(form, this.props.formModelMeta.printMapping.form);
  }

  formReadyToSign(form){
    return (!!form && (!form.fishingEvents.find(f => !f.eventValid)) && (!form.fishingEvents.find(f => f.signature)));
  }

  renderSignatureAndDate(){
    if(!(this.props.viewingForm && this.props.viewingForm.fishingEvents[0].signature)){
      return null;
    }
    const signStyle = this.props.formType == 'tcer' ? styles.signImageTCER : styles.signImageLCER;
    const dateStyle = this.props.formType == 'tcer' ? styles.dateSignedTCER : styles.dateSignedLCER;
    return [
      (<Image source={{uri: "data:image/png;base64," + this.props.viewingForm.fishingEvents[0].signature.toString()}}
              style={[signStyle, {width: 120, height: 40}]}
              key={"SignatureImage"} />),
      (<View style={[dateStyle]} key={"DateSignedText"}>
         <Text style={[{color: colors.red}]}>{this.props.viewingForm.fishingEvents[0].dateSigned.format("DD  MM   YYYY")}</Text>
       </View>)
    ];
  }

  render() {
    let text = [];
    const form = this.props.viewingForm;
    if(form){
      text = this.renderForm(form);
      text = this.renderFishingEvents(text, form);
    }

    //let canSignAll = !this.props.forms.find(f => !this.formReadyToSign(f)) &! this.props.forms.every(f => f.signed);
    const canSignOne = this.formReadyToSign(form);
    const signColor = canSignOne ? colors.blue : colors.darkGray;
    const detailToolbar = (
      <DetailToolbar
        right={{color: signColor, text: "Sign", onPress: () => this.toggleSignature(canSignOne), enabled: true}}
        left={{color: colors.pastelGreen, text: "Send", onPress: this.sendFormImage, enabled: true}}
        center={<Text style={[textStyles.font]}>{this.props.viewingForm ? this.props.viewingForm.id : null}</Text>}
      />
    );
    //right={{color: colors.blue, text: "Sign all", onPress: () => this.toggleSignature("all", canSignAll), enabled: canSignAll}}
    const masterToolbar = (
      <MasterToolbar
        center={
          <View style={{marginTop: 36}}>
            <Text style={[textStyles.font, textStyles.midLabel]}>
              Forms
            </Text>
          </View>
        }
      />
    );

    const signatureView = this.state.showSignature ?
      (<View style={[styles.signatureViewContainer, {backgroundColor: "white"}, shadowStyles.shadowDown]}>
        <SignatureView
          style={[{flex:1}, styles.signature]}
          ref="sign"
          onSaveEvent={this._onSaveEvent}
          saveImageFileInExtStorage={false}
          showNativeButtons={false}
          viewMode={"landscape"}/>
        </View>) : null;
//<View style={[styles.greyBackground]}></View>
    const greyBackground = (this.state.showSignature || this.state.showSignatureWarning) ?
      (<View style={[styles.greyBackground]}></View>):null;


    const signatureWarningView = this.state.showSignatureWarning ?
      (<View style={[styles.signatureWarningViewContainer, {backgroundColor: "white"}, shadowStyles.shadowDown, ]}>
        <Text style={{color: 'red', textAlign: 'center', fontSize: 17, padding: 10}}>WARNING</Text>
        <Text>Once you tap continue, you will no longer be able to edit the shots on this form.</Text>
        <Text>Please note: Signing this form will submit the form directly to FishServe.</Text>
        <Text>This Form has the same legal status as the paper TCER form.</Text>
        <View style={{flexDirection: 'row', marginTop: 30, margin: 0}}>
        <TouchableOpacity key={"Cancel"} style={{ flex: 1}}
            onPress={() => this.setState({showSignatureWarning: false, showSignature: false})}
          ><Text style={{textAlign: 'left', fontSize: 18, padding: 10}}>Cancel</Text></TouchableOpacity>
        <TouchableOpacity key={"Continue"} style={{flex: 1}}
            onPress={() => this.setState({showSignatureWarning: false, showSignature: true})}
          ><Text style={{color: colors.orange, textAlign: 'right', fontSize: 18, padding: 10}}>Continue</Text></TouchableOpacity>
        </View>
        </View>) : null;

    const renderedForm = renderForm(this.props.formType, text, styles);
    const formWrapperStyle = [styles.col, styles.fill, {alignSelf: 'flex-start'},
                  styles.wrapper, {opacity:this.props.viewingForm ? 1 : 0}]
    const detailView = (
      <ScrollView horizontal>
        <View
          style={formWrapperStyle}
          ref={'renderedForm'}
        >
          {renderedForm}
          {this.renderSignatureAndDate()}
          {greyBackground}
          {signatureView}
          {signatureWarningView}
        </View>
      </ScrollView>
    );

    return (
      <MasterDetailView
        master={this.renderFormsListView()}
        detail={detailView}
        detailToolbar={detailToolbar}
        masterToolbar={masterToolbar}
      />
    );
  }
}

const select = (State, dispatch) => {
    const state = State.default;
    return {
      user: state.me.user,
      vessel: state.me.vessel,
      viewingForm: state.forms.viewingForm,
      fishingEvents: state.fishingEvents.events,
      selectedIndex: state.forms.viewingFormIndex,
      formType: state.me.formType,
      formModelMeta: ModelUtils.blankModel(getFormModelByTypeCode(state.me.formType)).meta,
    };
}

module.exports = connect(select)(FormView);
