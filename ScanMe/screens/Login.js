import React, { Component } from "react";
import { View,Text,StyleSheet,TouchableOpacity,Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput , MD3LightTheme as DefaultTheme } from 'react-native-paper';

import Style from "./Style";
import logo from "./logo.png";
import {SERVER_IP} from "../serverConnect"

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#04bbd4',

  },
};

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      errorTxt: "",
      backgroundColor: 'transparent',
      color: 'red'

    };
  }
  
  login = async () => {

    let email = this.state.email.toLowerCase();
    let pass = this.state.password;


    if(email || pass == "")
    {

    }
    
    fetch(SERVER_IP+"login?email="+email+"&password="+pass)
      .then(async(response) => {
      
  
        if (response.status == 200) {
           response.json().then(async(json) => {
           
            await AsyncStorage.setItem("@id", String(json[0].id));
            
            this.props.navigation.navigate("Homes");
           })
          

         
        } else if (response.status == 403) {
          return this.setState({ errorTxt: "Email doesnt Exist" });
          //used display the resposnes from the server
        } else if (response.status == 403) {
          return this.setState({ errorTxt: "Invalid Password" });
          //each error code returns a diffrent response to the user
        } else {
          return this.setState({ errorTxt: "Something went wrong" });
        }
      })
      .catch((error) => {
        console.error(error);
      });
      
  };


 
  

  render() {
    return (
     
        <View style={Style.welcome}>
          <TextInput
          
            style={Style.inputBox}
            onChangeText={(value) => this.setState({ email: value })}
            value={this.state.email}
            label="Email"r
            theme={theme}
          />

          <TextInput
          
            style={Style.inputBox}
            secureTextEntry={true}
            onChangeText={(value) => this.setState({ password: value })}
            value={this.state.password}
            label="Password"
            theme={theme}
          />

          <Text style={Style.errorText}>{this.state.errorTxt}</Text>

          <TouchableOpacity
            style={Style.buttonStyleDefault}
            onPress={() => {
              this.login();
            }}
          >
            <Text style={Style.buttonText}>LOGIN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={Style.buttonStyleDefault}
            onPress={() => this.props.navigation.navigate("SignUP")}
          >
            <Text style={Style.buttonText}>CREATE ACCOUNT</Text>
          </TouchableOpacity>
        </View>
    
    );
  }
}

export default Login;
