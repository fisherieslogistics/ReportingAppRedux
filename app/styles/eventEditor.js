import colors from './colors';

export default {
  innerWrapper:{
   paddingTop: 6,
   paddingLeft: 5,
   paddingBottom: 3,
  },
  outerWrapper: {
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
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
    flex: 0.8,
    paddingBottom: 4
  },
  fill: {
    flex: 1,
  },
  labelRow: {
    flex: 0.5,
  },
  labelText: {
    color: colors.blue,
    fontSize: 18,
  },
  labelError: {
    marginLeft: 4,
    color: colors.orange
  },
  rowSection: {
    flex: 0.4
  },
  errorDot: {
    width: 10,
    height: 10,
    backgroundColor: colors.orange,
    borderRadius: 5,
    margin: 4,
  },
  inputRow: {
    alignSelf: 'stretch',
    flex: 1,
    borderBottomWidth: 1,
    paddingTop: 2,
    paddingBottom: 2,
    borderBottomColor: colors.lightestGray
  }
}
