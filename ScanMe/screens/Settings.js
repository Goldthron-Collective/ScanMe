import React, { Component } from "react";
import { View, Text, Alert,Modal,StyleSheet ,Pressable} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Style from "./Style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_IP } from "../serverConnect"
import { TextInput , MD3LightTheme as DefaultTheme } from 'react-native-paper';
const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#04bbd4',

  },
};

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
      modalVisible4: false,
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
     
       
        <View style={Style.container}>

        <Text>{this.state.errorTxt}</Text>
           
          <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          this.setState({modalVisible: !this.state.modalVisible});
        }}
      >
        <View style={Style.centeredView}>
          <View style={Style.modalView}>
            <Text style={Style.modalText}>Change Password</Text>

            
            <TextInput
              style={Style.inputBox}
              secureTextEntry={true}
              onChangeText={(value) => this.setState({ curPass: value })}
              value={this.state.curPass}
              label="Current Password"
              theme={theme}
            />

            <TextInput
              style={Style.inputBox}
              secureTextEntry={true}
              onChangeText={(value) => this.setState({ pass: value })}
              value={this.state.pass}
              label="New Password"
              theme={theme}
            
            />

            <TextInput
              style={Style.inputBox}
              secureTextEntry={true}
              onChangeText={(value) => this.setState({ passConf: value })}
              value={this.state.passConf}
              label="Re-Type Password"
              theme={theme}
              
            />
            <Text>{this.state.errorPass}</Text>
            <Pressable
              style={[Style.button]}
              onPress={() => {this.confirm()}}
            >
              <Text style={Style.textStyle}>Change</Text>
            </Pressable>


             <Pressable
              style={[Style.button]}
              onPress={() => {this.setState({modalVisible: !this.state.modalVisible}); this.setState({pass: ""})}}
            >
              <Text style={Style.textStyle}>Cancel</Text>
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
        <View style={Style.centeredView}>
          <View style={Style.modalView}>
            <Text style={Style.modalText}>Are You Sure You Want to Permantly Delete All Your Recipt Data?</Text>

            <Pressable
              style={[Style.button]}
              onPress={() => {this.deleteReciptData(); this.setState({modalVisible2: !this.state.modalVisible2})}}
            >
              <Text style={Style.textStyle}>Yes</Text>
            </Pressable>


             <Pressable
              style={[Style.button]}
              onPress={() => {this.setState({modalVisible2: !this.state.modalVisible2}); this.setState({errorDelData: ""})}}
            >
              <Text style={Style.textStyle}>No</Text>
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
        <View style={Style.centeredView}>
          <View style={Style.modalView}>
            <Text style={Style.modalText}>WARNING YOU WILL PERMANTLY DELETE YOUR ACCOUNT AND ALL DATA AND CANNOT BE UNDONE!</Text>

            <Pressable
              style={[Style.button]}
              onPress={() => {this.deleteAccount(); this.setState({modalVisible3: !this.state.modalVisible3})}}
            >
              <Text style={Style.textStyle}>Yes</Text>
            </Pressable>


             <Pressable
              style={[Style.button]}
              onPress={() => {this.setState({modalVisible3: !this.state.modalVisible3}); this.setState({errorDelData: ""})}}
            >
              <Text style={Style.textStyle}>No</Text>
            </Pressable>
         
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible4}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          this.setState({modalVisible4: !this.state.modalVisible4});
        }}
      >
        <View style={Style.centeredView}>
          <View style={Style.modalView}>
            <Text style={Style.modalText}>Are You Sure You Want To Logout?!</Text>

            <Pressable
              style={[Style.button]}
              onPress={() => {this.logout(); this.setState({modalVisible4: !this.state.modalVisible4})}}
            >
              <Text style={Style.textStyle}>Yes</Text>
            </Pressable>


             <Pressable
              style={[Style.button]}
              onPress={() => {this.setState({modalVisible4: !this.state.modalVisible4}); this.setState({errorDelData: ""})}}
            >
              <Text style={Style.textStyle}>No</Text>
            </Pressable>
         
          </View>
        </View>
      </Modal>

      <Pressable
        style={[Style.button]}
        onPress={() => this.setState({modalVisible4: true})}
      >
        <Text style={Style.textStyle}>Logout</Text>
      </Pressable>

      <Pressable
        style={[Style.button]}
        onPress={() => this.setState({modalVisible: true})}
      >
        <Text style={Style.textStyle}>Change Password </Text>
      </Pressable>

      <Pressable
        style={[Style.button]}
        onPress={() => this.setState({modalVisible2: true})}
      >
        <Text style={Style.textStyle}>Delete Recipt Data </Text>
      </Pressable>

      <Pressable
        style={[Style.button]}
        onPress={() => this.setState({modalVisible3: true})}
      >
        <Text style={Style.textStyle}>Delete Account</Text>
      </Pressable>

        </View>
     
    );
  }
}

export default SignUP;
