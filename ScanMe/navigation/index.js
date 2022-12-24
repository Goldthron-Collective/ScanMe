import React, { Component } from 'react';
import * as ALL from 'react';
import { Text, View ,TextInput,Button,FlatList, Alert,Image} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SignUP from '../screens/SignUP'
import Login from '../screens/Login'

import Save from '../screens/Save'
import Camera from '../screens/Camera'
import History from '../screens/History'
import Settings from '../screens/Settings'
import ViewHistory from '../screens/MoreHistory'


const Tab = createBottomTabNavigator();

class index extends Component {

  render() {
    return (
       <NavigationContainer>
       <Tab.Navigator 
       initialRouteName="Login"
       options={{headerShown: false}}>
         <Tab.Screen name="Homes" component={this.Homes} options={{tabBarStyle: { display: "none" },headerShown: false}} />
         <Tab.Screen name="Login" component={Login} options={{tabBarStyle: { display: "none" },headerShown: false }}/>
         <Tab.Screen name="SignUP" component={SignUP}  options={{tabBarStyle: { display: "none" },headerShown: false }}/>
       </Tab.Navigator>
       </NavigationContainer>
    );    
         
   }

  Homes = () => 
  {
  return(
    
    <Tab.Navigator 

    initialRouteName="Camera"
    
    
    screenOptions={({ route }) => ({
      tabBarButton: [
        "Save",
        "MoreHistory",
      ].includes(route.name)
        ? () => {
            return null;
          }
        : undefined,

    })}>  
      <Tab.Screen name="Settings" component={Settings}
       options={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarIcon: () => {
          return <Image style={{height: 45, width: 45}} source={require('../assets/images/settings.png')} />
        }
      }}
       
       />

      <Tab.Screen name="Camera" component={Camera}  
       options={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarIcon: () => {
          return <Image style={{height: 45, width: 45}} source={require('../assets/images/camera.png')} />
        }
      }}
      //, tabBarIcon: ({size,focused,color}) => {return (<Image style={{height:25,width:25}}source={require('./assets/profile.png')}/>)}
      listeners={({ navigation, route }) => ({
    tabPress: e => {
      // Prevent default action
      e.preventDefault();
      navigation.navigate('Camera')
    },})}/>

      <Tab.Screen name="History" component={History} 
       options={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarIcon: () => {
          return <Image style={{height: 45, width: 45}} source={require('../assets/images/history.png')} />
        }
      }}/>

      <Tab.Screen name="Save" component={Save} options={{headerShown: false ,  tabBarShowLabel: false,}} />
      <Tab.Screen name="MoreHistory" component={ViewHistory} options={{headerShown: false,  tabBarShowLabel: false,}} />
    </Tab.Navigator>
    
    );
}




}
export default index


 