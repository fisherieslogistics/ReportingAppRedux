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

const helper = new Helper();

const Editors = (props) => {
  let inputs = [];
  let labels = []
  props.model.forEach((attribute, i) => {
      if(attribute.readOnly || attribute.hidden) {
          return;
      }
      //i being zero means top row - use it to render the error bubble on the side
      const isTopRow = i === 1;
      console.log(!i, isTopRow, "topRow", i);
      inputs.push(renderEditor(attribute, props, isTopRow));
  });

  return <View>{ inputs }</View>;
}

const SingleEditor = ({ attribute, styles, getEditor, value, focusedAttributeId, editingCallback, onEnterPress, isTopRow }) => {
  if(!attribute.valid) {
    throw new Error(`${attribute.id} doesn't have a validator`);
  }
  console.log("TOP", isTopRow);
  const errorView = attribute.valid.func(value) ? null : errorBubble(focusedAttributeId, attribute, isTopRow);
  return (
    <TouchableOpacity style={[styles.col, styles.inputRow]}
          key={attribute.id}
          onPress={() => {
            editingCallback(attribute.id, true)
    }}>
        <View style={[styles.row, styles.labelRow]}>
          <Text style={styles.labelText}>
            {attribute.label}
          </Text>
          { errorView }
        </View>
        <View style={[styles.row, styles.editorRow]}>
          {AttributeEditor(getEditor(attribute), editingCallback, focusedAttributeId)}
        </View>
    </TouchableOpacity>
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
          if(e.editor === null){
            return (
              <View style={[styles.rowSection]}
                    key={ "editor__" + e.label + index }>
                <View style={[styles.labelRow]}>
                  <Text style={[styles.labelText, {color: 'black'}]}>
                    {e.label}
                  </Text>
                </View>
              </View>
            );
          }
          if(e.editor && !e.editor.attribute.valid) {
            throw new Error(`${e.editor.attribute.id} doesn't have a validator`);
          }
          const isValid = !e.editor || e.editor.attribute.valid.func(e.editor.value);
          const errorView = isValid ? null : errorBubble(focusedAttributeId, e.editor.attribute, isTopRow);
          return (
              <TouchableOpacity
                style={[styles.rowSection]}
                key={"editor__" + e.label + index}
                onPress={() => {
                  e.editor && editingCallback(e.editor.attribute.id, true);
                }}>
                <View style={[styles.labelRow, { flexDirection: 'row'}]}>
                  <Text style={styles.labelText}>
                    {e.label}
                  </Text>
                  { errorView }
                </View>
                <View style={[styles.editorRow]}>
                  {e.editor && AttributeEditor(e.editor, (focusedId) => editingCallback(e.editor.attribute.id, focusedId), focusedAttributeId, _index)}
                </View>
            </TouchableOpacity>
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
            editingCallback={focusedAttributeId => props.editingCallback(attribute.id, focusedAttributeId)}
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
    this.state = {
      value: props.value,
      renderedValue: this.getRenderedValue(props.value),
      inputId: props.inputId
    }
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
    this.props.editingCallback(true);
    this.props.onEnterPress ? this.props.onEnterPress() : null;
  }

  onKeyPress(event) {
    if(event.nativeEvent.key === 'Enter' && this.props.onEnterPress){
      console.log("AAAA", this.props.attribute.id, this.props)
      this.props.onEnterPress(this.props.attribute.id);
    }
  }

  onBlur(){
    this.props.callback(this.props.attribute.id, this.getCorrectedValue(this.state.value));
    this.props.editingCallback(false);
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
        keyboardType={this.getKeypad.bind(this)()}
        placeholderText={this.props.attribute.label}
        value={this.state.renderedValue}
        style={inputStyles.textInput}
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onChangeText={this.onChangeText.bind(this)}
        focus={ this.props.focus }
        onKeyPress={this.onKeyPress.bind(this)}
        {...this.props.extraProps} />
    );
  }
}


const AttributeEditor = ({ attribute, value, onChange, extraProps, inputId, onEnterPress }, editingCallback, focusedAttributeId, index) => {
  if(!extraProps) {
    extraProps = {};
  }
  let focus = (focusedAttributeId === attribute.id);
  if((isNaN(index) === false) && focusedAttributeId){
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
          format="MMM DD HH:mm"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateText: inputStyles.dateText,
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
