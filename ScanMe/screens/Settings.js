import React, { Component } from "react";
import { View, Text, ScrollView, TextInput, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Style from "./Style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_IP } from "../serverConnect"

class SignUP extends Component {
  constructor(props) {
    super(props);

    this.state = {
   
    };
  }
  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {

    this.checkLoggedIn()
   

  });
  }
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
  };
  

  render() {
    return (
     
       
        <View style={Style.welcome}>
           
          <TouchableOpacity
            onPress={this.logout()}
            style={Style.buttonStyleDefault}
          >
            <Text style={Style.buttonText}>Logout</Text>
          </TouchableOpacity>

        </View>
     
    );
  }
}

export default SignUP;
