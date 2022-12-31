import React, { Component } from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Style from "./Style";
import logo from "./logo.png";
import { SERVER_IP } from "../serverConnect"
import { TextInput ,MD3LightTheme as DefaultTheme} from 'react-native-paper';

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
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPw : "",
      errorTxt: "",
    };
  }

  
  signup = () => {

    
    const regEmail = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    const regName = new RegExp("^(?=.{1,40}$)[a-zA-Z]+(?:[-'s][a-zA-Z]+)*$");

    let emailReg = regEmail.test(this.state.email);
    let first = regName.test(this.state.first_name);
    let last = regName.test(this.state.last_name);

    if (emailReg == false || this.state.email.length == 0) {
      return this.setState({ errorTxt: "Invalid Email" });
    } else if (this.state.password.length <= 5) {
      return this.setState({errorTxt: "Invalid Password"});
    } else if (first == false || this.state.first_name.length == 0) {
      return this.setState({ errorTxt: "Invalid First Name" });
    } else if (last == false || this.state.last_name.length == 0) {
      return this.setState({ errorTxt: "Invalid Last Name" });
    }



 return fetch(SERVER_IP+"signup?email="+this.state.email+"&password="+this.state.password+"&first_name="+ this.state.first_name+"&last_name=+"+this.state.last_name) 
  .then((response)=>{
    
    if (response.status == 200) {
       this.props.navigation.navigate("Login");
    }
  })
  .catch((error)=>{
      alert("Error Occured" + error);
  })

      
  };
  

  render() {
    return (
     
       
        <View style={Style.welcome}>
           
          <TextInput
            label="First Name..."
            onChangeText={(first_name) => this.setState({ first_name })}
            value={this.state.first_name}
            style={Style.inputBox}
            theme={theme}
          />
          <TextInput
            label="Last Name..."
            onChangeText={(last_name) => this.setState({ last_name })}
            value={this.state.last_name}
            style={Style.inputBox}
            theme={theme}
          />
          <TextInput
            label="Email..."
            onChangeText={(email) => this.setState({ email })}
            value={this.state.email}
            style={Style.inputBox}
            theme={theme}
          />
          <TextInput
            label="Password..."
            onChangeText={(password) => this.setState({ password })}
            value={this.state.password}
            secureTextEntry
            style={Style.inputBox}
            theme={theme}
          />
          <Text style={Style.errorText}>{this.state.errorTxt}</Text>
          <TouchableOpacity
            onPress={() => this.signup()}
            style={Style.buttonStyleDefault}
          >
            <Text style={Style.buttonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Login")}
            style={Style.buttonStyleDefault}
          >
            <Text style={Style.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
     
    );
  }
}

export default SignUP;
