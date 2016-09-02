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
    backgroundColor: '#fff',
    borderRadius: 6,
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
    color: colors.blue,
    fontSize: 16,
  },
  labelError: {
    marginLeft: 4,
    color: colors.orange
  },
  rowSection: {
    flex: 0.3
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
    borderBottomColor: colors.midGray
  }
}
