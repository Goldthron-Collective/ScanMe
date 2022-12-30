import React, { Component } from "react";
import { View, Text, Alert,Modal,StyleSheet ,Pressable,TextInput} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Style from "./Style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_IP } from "../serverConnect"

class SignUP extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id : "",
      errorTxt: "",
      data: "",
      modalVisible: false,
      modalVisible2: false,
      modalVisible3: false,
      pass:"",
      passConf:"",
      curPass:"",
      errorPass:"",
      
   
    };
  }
  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {

    this.checkLoggedIn();
   

  });
  }
  //change password
  //change email
  //delete all data (drop all recipt data)
  //delete account
async componentWillUnmount() {
  this.unsubscribe();
}

  
  logout = async () => {

    await AsyncStorage.removeItem("@id").then(
      () => this.props.navigation.navigate("Login")
    );
    
  };

  checkLoggedIn = async () => {
    const id = await AsyncStorage.getItem("@id");
    console.log(id);

    if (id == null) {
      this.props.navigation.navigate("Login");
    }
    else
    {
      this.setState({id: id});
    }
  };
  deleteReciptData = async() =>
  {

    
    return fetch(SERVER_IP+"deleteAllRecipts?id="+this.state.id).then(async(response) => {
      if(response.status == 200)
      {
        return this.setState({errorTxt: "Sucessfully Deleted All Recipt Data"});
      }
      else 
      {
        return this.setState({errorTxt: "Erorr / No Data Found"});
      }
    })

  }
  deleteAccount = async() =>
  {
    fetch(SERVER_IP+"deleteAllRecipts?id="+this.state.id).then(async() => {
      return fetch(SERVER_IP+"deleteAccount?id="+this.state.id).then(async(response) =>{
        if(response.status == 200)
        {
        
          return this.logout();

        }
        else
        {
          return this.setState({errorTxt: "Unable To Delete Account"});
        }
      })

    })
  }

  confirm = async() =>{
    //compare this.state.curPass with acutal current password else send error
    let oldPass = this.state.curPass;
    let pass = this.state.pass;
    let passConf = this.state.passConf;


    if(oldPass == "" || pass == "" ||passConf  == "" )
    {
      return this.setState({errorPass: "Fields Must Not Be Empty"})
      

    }
    else if(pass != passConf)
    {
      return this.setState({errorPass: "New Passwords Dont Match"})
     
    }
    
    fetch(SERVER_IP+"updatePass?password="+oldPass+"&id="+this.state.id+"&newpass="+pass)
      .then(async(response) => {
        if (response.status == 200) 
        {
          return this.setState({ errorPass: "Password Updated Sucessfully" });
        } 
        else if (response.status == 404) 
        {
          return this.setState({ errorPass: "Current Password Incorrect" });
        }
      })
      .catch((error) => {
        console.log(error);
        return this.setState({ errorPass: "Something Went Wrong" });
      });
  }
  

  render() {
    return (
     
       
        <View style={styles.container}>

        <Text>{this.state.errorTxt}</Text>
           
           <TouchableOpacity
            onPress={() => this.logout()}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>

          <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          this.setState({modalVisible: !this.state.modalVisible});
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Change Password</Text>

            
            <TextInput
              style={Style.inputBox}
              secureTextEntry={true}
              onChangeText={(value) => this.setState({ curPass: value })}
              value={this.state.curPass}
              placeholder="Current Password"
            />

            <TextInput
              style={Style.inputBox}
              secureTextEntry={true}
              onChangeText={(value) => this.setState({ pass: value })}
              value={this.state.pass}
              placeholder="New Password"
            />

            <TextInput
              style={Style.inputBox}
              secureTextEntry={true}
              onChangeText={(value) => this.setState({ passConf: value })}
              value={this.state.passConf}
              placeholder="Confirm Password"
            />
            <Text>{this.state.errorPass}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {this.confirm()}}
            >
              <Text style={styles.textStyle}>Change</Text>
            </Pressable>


             <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {this.setState({modalVisible: !this.state.modalVisible}); this.setState({pass: ""})}}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
         
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible2}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          this.setState({modalVisible2: !this.state.modalVisible2});
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Are You Sure You Want to Permantly Delete All Your Recipt Data?</Text>

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {this.deleteReciptData(); this.setState({modalVisible2: !this.state.modalVisible2})}}
            >
              <Text style={styles.textStyle}>Yes</Text>
            </Pressable>


             <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {this.setState({modalVisible2: !this.state.modalVisible2}); this.setState({errorDelData: ""})}}
            >
              <Text style={styles.textStyle}>No</Text>
            </Pressable>
         
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible3}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          this.setState({modalVisible3: !this.state.modalVisible3});
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>WARNING YOU WILL PERMANTLY DELETE YOUR ACCOUNT AND ALL DATA AND CANNOT BE UNDONE!</Text>

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {this.deleteAccount(); this.setState({modalVisible3: !this.state.modalVisible3})}}
            >
              <Text style={styles.textStyle}>Yes</Text>
            </Pressable>


             <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {this.setState({modalVisible3: !this.state.modalVisible3}); this.setState({errorDelData: ""})}}
            >
              <Text style={styles.textStyle}>No</Text>
            </Pressable>
         
          </View>
        </View>
      </Modal>


      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => this.setState({modalVisible: true})}
      >
        <Text style={styles.textStyle}>Change Password </Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => this.setState({modalVisible2: true})}
      >
        <Text style={styles.textStyle}>Delete Recipt Data </Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => this.setState({modalVisible3: true})}
      >
        <Text style={styles.textStyle}>Delete Account</Text>
      </Pressable>

        </View>
     
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
   
  },
  buttonText:{
    color: "white"
  },
  button:
  {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#1e90ff',
    margin: 10,
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
    margin: 20,
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
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});


export default SignUP;
