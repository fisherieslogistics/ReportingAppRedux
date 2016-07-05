import colors from './colors';

export default {
  innerWrapper:{
   paddingTop: 10,
   paddingLeft: 30,
   paddingBottom: 10,
  },
  outerWrapper: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: "hidden"
  },
  topWrapper: {
  },
  bottomWrapper: {
  },
  col:{
    flexDirection: 'column',
  },
  row:{
    flexDirection: 'row',
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
  rowSection: {
    flex: 0.3
  },
  inputRow: {
    paddingTop: 5,
    alignSelf: 'stretch',
    borderBottomWidth: 1,
    borderBottomColor: colors.midGray
  }
}
