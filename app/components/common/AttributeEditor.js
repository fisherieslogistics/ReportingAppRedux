'use strict';
import {
  View,
  Text,
  Switch,
  AlertIOS,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import FishPicker from '../FishPicker';
import ContainerPicker from '../ContainerPicker';
import DatePicker from 'react-native-datepicker';
import {inputStyles, textStyles, colors} from '../../styles/styles';
import Sexagesimal from 'sexagesimal';
import moment from 'moment';
import {LongButton} from './Buttons';
import Helper from '../../utils/Helper';
import FocusOnDemandTextInput from './FocusOnDemandTextInput';
import LocationEditor from '../LocationEditor';
import errorBubble from './ErrorBubble';
import TouchableEditor from './TouchableEditor';

const helper = new Helper();

const Editors = (props) => {
  let inputs = [];
  let labels = [];
  props.model.forEach((attribute, i) => {
      if(attribute.readOnly || attribute.hidden) {
          return;
      }
      //i being zero means top row - use it to render the error bubble on the side
      const isTopRow = i === 1;
      inputs.push(renderEditor(attribute, props, isTopRow));
  });

  return <View>{ inputs }</View>;
}

const SingleEditor = ({ attribute, styles, getEditor, focusedAttributeId, editingCallback, isTopRow, value, inputId }) => {
  if(!attribute.valid) {
    throw new Error(`${attribute.id} doesn't have a validator`);
  }
  const errorView = attribute.valid.func(value) ? null : errorBubble(focusedAttributeId, attribute, true);
  const input = AttributeEditor(getEditor(attribute), editingCallback, focusedAttributeId);
  return (
    <TouchableEditor
      styles={ styles }
      wrapperStyle={ [styles.col, styles.inputRow] }
      errorView={ errorView }
      onPress={ () => editingCallback(attribute.id) }
      inputId={ attribute.id }
      input={ input }
      label={ attribute.label }
    />
  );
}

const getCombinedEditors = (attribute, model, getEditor) => {
  let editors = [{label: attribute.label, editor: getEditor(attribute) }];
  let addedEditors = attribute.editorDisplay.siblings.map((s) => {
      let attr = model.find((a) => {
                   return a.id === s;
                  });
      return {label: attr.label, editor: getEditor(attr)};
  });
  return editors.concat(addedEditors);
}

const renderCombinedEditors = (combinedEditors, styles, editingCallback, focusedAttributeId, _index, isTopRow) => {
  return (
    <View style={[styles.col, styles.inputRow]}
          key={"editor" + combinedEditors.map(e => e.editor && e.editor.attribute.id).join('.') + _index }>

      <View style={[styles.row, { flex: 1, alignSelf: 'stretch' }]}>
        {combinedEditors.map((e, index) => {

          if(!e.editor){
            return (
              <TouchableEditor
                key={ "editor__" + e.label + index  }
                styles={ styles }
                wrapperStyle={ [styles.rowSection] }
                onPress={ () => null }
                inputId={ "editor__" + e.label + index }
                input={ null }
                label={ e.label }
              />
            );
          }

          if(e.editor && !e.editor.attribute.valid) {
            throw new Error(`${e.editor.attribute.id} doesn't have a validator`);
          }

          const isValid = e.editor.attribute.valid.func(e.editor.value);
          const errorView = isValid ? null : errorBubble(focusedAttributeId, e.editor.attribute, true);

          return (
            <TouchableEditor
              key={ e.editor.attribute.id }
              styles={ styles }
              wrapperStyle={ [styles.rowSection] }
              onPress={ () => editingCallback(e.editor.attribute.id) }
              inputId={ e.editor.attribute.id }
              errorView={ errorView }
              input={ AttributeEditor(e.editor, (focusedId) => editingCallback(focusedId), focusedAttributeId, _index) }
              label={ e.editor.attribute.label }
            />
          );
        })}
      </View>
    </View>
  );
}

const renderEditor = (attribute, props, isTopRow) => {
  if(attribute.editorDisplay && attribute.editorDisplay.hideUndefined && props.obj[attribute.id] === undefined){
    return null;
  }
  if(attribute.editorDisplay && attribute.editorDisplay.editor === props.editorType){
    switch (attribute.editorDisplay.type) {
      case "single":
        return (
          <SingleEditor
            isTopRow={isTopRow}
            attribute={attribute}
            styles={props.styles}
            getEditor={props.getEditor}
            value={props.values[attribute.id]}
            focusedAttributeId={ props.focusedAttributeId }
            key={attribute.id}
            editingCallback={focusedAttributeId => props.editingCallback(focusedAttributeId)}
          />);
      case "combined":
        const combinedEditors = getCombinedEditors(attribute, props.model, props.getEditor);
        return renderCombinedEditors(combinedEditors, props.styles, props.editingCallback, props.focusedAttributeId, isTopRow);
      default:
    }
  }
}

class EditOnBlur extends React.Component {

  constructor(props){
    super(props);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.state = {
      value: props.value,
      renderedValue: this.getRenderedValue(props.value),
      inputId: props.inputId
    }
    this.onFocus = this.onFocus.bind(this);
    this.getKeypad = this.getKeypad.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
  }

  componentWillReceiveProps(props){
    if(props.inputId !== this.state.inputId){
      this.setState({
        value: props.value,
        inputId: props.inputId,
        renderedValue: this.getRenderedValue(props.value)
      });
    }
  }

  onChangeText(text){
    this.setState({
      value: text,
      renderedValue: text
    })
  }

  onFocus(){
    this.props.editingCallback(this.props.attribute.id);
    this.props.onEnterPress ? this.props.onEnterPress() : null;
  }

  onKeyPress(event) {
    if(event.nativeEvent.key === 'Enter' && this.props.onEnterPress){
      this.props.onEnterPress(this.props.attribute.id);
    }
  }

  onBlur(){
    this.props.callback(this.props.attribute.id, this.getCorrectedValue(this.state.value));
    this.props.editingCallback();
    this.setState({
      renderedValue: this.getRenderedValue(this.state.value),
    });
  }

  getKeypad(){
    switch (this.props.attribute.type) {
      case "number":
        return 'number-pad'
      case "float":
        return 'numeric'
      default:
        return 'default'
    }
  }

  getCorrectedValue(value){
    switch (this.props.attribute.type) {
      case "number":
        return isNaN(parseInt(value)) ? "0" : parseInt(value).toString();
      case "float":
        return isNaN(parseFloat(value)) ? "0.00" : parseFloat(value).toFixed(2).toString();
      default:
        return (value !== null && value !== undefined) ? value.toString() : "";
    }
  }

  getRenderedValue(value){
    return this.getCorrectedValue(value) + (this.props.attribute.unit ? " " + this.props.attribute.unit : "");
  }

  render(){
    return (
      <FocusOnDemandTextInput
        selectTextOnFocus={true}
        autoCorrect={false}
        autoCapitalize={'none'}
        keyboardType={this.getKeypad()}
        placeholderText={this.props.attribute.label}
        value={this.state.renderedValue}
        style={inputStyles.textInput}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onChangeText={this.onChangeText}
        focus={ this.props.focus }
        onKeyPress={ this.onKeyPress }
        {...this.props.extraProps}
     />
    );
  }
}


const AttributeEditor = ({ attribute, value, onChange, extraProps, inputId, onEnterPress }, editingCallback, focusedAttributeId, index) => {
  if(!extraProps) {
    extraProps = {};
  }
  let focus = (focusedAttributeId === attribute.id);
  //if(focusfocusedAttributeId, attribute.id);
  if( !isNaN(parseInt(index)) && focusedAttributeId){
    const attrId = focusedAttributeId.split("__")[0];
    const attrIndex = focusedAttributeId.split("__")[1];
    focus = (attrId === attribute.id) && (attrIndex == index);
  }
  //return (<View style={{paddingTop: 6}}><Text sty le={textStyles.font, textStyles.midLabel}>{}</Text></View>);
  switch (attribute.type) {
    case "labelOnly":
      return (<Text>{value}</Text>);
    case "displayOnly":
    case "datetime":
      return (
        <DatePicker
          date={ value ? value.toDate() : new Date()}
          mode="datetime"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateText: Object.assign({}, inputStyles.dateText, {left: 45}),
            dateInput: inputStyles.dateInput,
            dateIcon: inputStyles.dateIcon,
          }}
          onDateChange={(datetime) => {
            onChange(attribute.id, new moment(datetime));
          }}
          {...extraProps}
          editingCallback={editingCallback}
      />);
      break;
    case "product":
      return (<FishPicker
                onChange={(value) => {
                  onChange(attribute.id, value);
                }}
                value={value}
                name={attribute.id}
                inputId={inputId}
                {...extraProps}
                editingCallback={editingCallback}
                focusedAttributeId={focusedAttributeId}
                onEnterPress={onEnterPress}
                focus={focus}
              />);
    case "container":
      return (<ContainerPicker
                onChange={(value) => {
                  onChange(attribute.id, value);
                }}
                value={value}
                name={attribute.id}
                inputId={inputId}
                {...extraProps}
                editingCallback={editingCallback}
                focusedAttributeId={focusedAttributeId}
                onEnterPress={onEnterPress}
                focus={focus}
              />);
    case "location":
      return (
        <LocationEditor
          attribute={attribute}
          value={value}
          onChange={ onChange }
          inputId={inputId}
          editingCallback={editingCallback}
        />
      );
      break;
    case "bool":
      return (<Switch
                onValueChange={(bool) => {
                  onChange(attribute.id, bool)
                }}
                value={value || false}
                {...extraProps}/>);
    case "number":
    case "float":
    default:
      return (
        <EditOnBlur
          attribute={attribute}
          value={value}
          callback={onChange}
          extraProps={extraProps}
          inputId={inputId}
          {...extraProps}
          editingCallback={editingCallback}
          focusedAttributeId={focusedAttributeId}
          focus={focus}
          onEnterPress={onEnterPress}
        />
      );
  }
}

export {renderEditor, Editors, SingleEditor, renderCombinedEditors, getCombinedEditors, AttributeEditor}
