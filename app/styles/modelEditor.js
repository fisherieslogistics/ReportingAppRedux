import colors from './darkColors';

export default {
  wrapper: {
    alignSelf: 'stretch',
    flex: 1,
  },
  innerWrapper: {
    paddingBottom: 3,
  },
  col:{
    flexDirection: 'column',
  },
  row:{
    flexDirection: 'row',
  },
  singleInput: {
    paddingBottom: 4,
    height: 50,
    marginLeft: 15,
  },
  combinedInput: {
    paddingBottom: 4,
    height: 50,
    marginLeft: 15,
  },
  fill: {
    flex: 1,
  },
  labelRow: {
    height: 20,
  },
  labelText: {
    color: colors.blue,
    fontSize: 15,
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
    borderBottomColor: colors.lightestGray
  },
}
