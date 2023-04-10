import { WhiteBalance } from 'expo-camera/build/Camera.types'
import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  Colors:
  {
    primary: '#226B74',
    secondary: '#254B5A',
    tertiary: '#5DA6A7',
    darkLight: '#254B5A',
    brand: '#254B5A',
    green: '#254B5A',
    red: '#254B5A'
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerHis:{
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title:{
    fontSize: 30,
    fontWeight: 'bold',
  },
  welcome:
  {
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 30,

  },
  centerText: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  homeButton: {
    borderRadius: 30,
    padding: 10,
    backgroundColor: '#04bbd4'
  },
  buttonStyleDefault:
  {
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: '#04bbd4'
  },
  inputBox: {
    padding: 2,
    borderRadius: 5,
    margin: 5,
    fontWeight: '500',
    backgroundColor: 'transparent'
  },

buttonText:
{
  textAlign: 'center',
  color: 'white',
  fontWeight: '700'

},
  titleText: {
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 20,
    textAlign: 'center'
  },
  searchBtn:
{
  borderRadius: 30,
  borderWidth: 2,
  padding: 10,
  marginHorizontal: 15,
  marginVertical: 10,
  borderColor: 'dodgerblue',
  backgroundColor: 'white'
},
  searchText:
{
  textAlign: 'center',
  color: 'black',
  fontWeight: '400'

},
  errorText:
{
  textAlign: 'center',
  fontWeight: '700',
  color: 'red'
},
  AcceptButton: {
   
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: 'green'
  },
  AcceptText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '400'
  },
  DeclineButton: {
   
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: 'red'
  },
  DeclineText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '400'
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 30,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
    imgModalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 0,
  flex: 1,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  button:{
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#04bbd4',
    margin: 10,
  },
  buttonHistory:{
    borderRadius: 4,
    elevation: 3,
    paddingVertical: 15,
   
  },
  imgHistory:{
    width: 30,
    height: 30,
    borderRadius: 5,
    borderColor: 'white',
    borderWidth: 0.5,
    marginRight: 20,
  },
  textTitle:{
    color: 'black',
    fontSize: 17,

  },
  textDate:{
    color: '#919191',
    fontSize: 14,
    fontWeight: "600",
  },
  textTotal:{
    fontSize: 19,
    fontWeight: "400",
  },
  textMonthTotal:{
    fontSize: 13,
    fontWeight: "400",
    color: '#919191'
  },

  datePicker: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: 320,
    height: 260,
    display: 'flex',
    color: 'black'

  },
  

})
