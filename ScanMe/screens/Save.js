import React, { Component , Fragment} from "react";
import { View,Text,StyleSheet,FlatList ,Button } from "react-native";
import Style from "./Style";

import AsyncStorage from '@react-native-async-storage/async-storage';
import {SERVER_IP} from "../serverConnect"
import { TextInput ,MD3LightTheme as DefaultTheme} from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#04bbd4',

  },
};

class Save extends Component {
  constructor(props) {
    super(props);
      this.state = {
        data: this.props.route.params.arrData,
        date: "Not Found",
        currency: "Not Found",
        change: "Not Found",
        total: "Not Found",
        items: [],
        itemPrice: [],
        map: [],
        title: "Untitled Recipt",
      };
    }



async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.getDate();
      this.getCurrency();
      this.getChange();
      this.getTotal();
      this.getItems();
      

  });
  }
async componentWillUnmount() {
  this.unsubscribe();
}

  getDate = async () => {
    const date1 = /\d{2}([\/.-])\d{2}\1\d{4}/;
    const date2 = /(?:^|\W)(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|(nov|dec)(?:ember)?)(?:$|\W)/;
    var date = null;

    for(let i = 0; i < this.state.data.length; i++)
    {
      date = this.state.data[i].match(date1);
      if(date != null)
      {
        date = this.state.data[i];
        break;
      }

      date = this.state.data[i].match(date2);
      if(date != null)
      {
        date = this.state.data[i];
        
        break;
      }      
    }
    if (date != null)
    {
      this.setState({date: date}, () => {
        
        console.log("date = " +this.state.date);
      });
    }
    else
    {
      this.setState({date: new Date()}, () => {
       
        console.log("date not found = " + this.state.date);
      });
    }
  


  }
  getCurrency = async () => 
  {
    const currencyRegex = /[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6]/;
    var currency = null;

    for(let i = 0; i < this.state.data.length; i++)
    {
      currency = this.state.data[i].match(currencyRegex);
     
      if(currency != null)
      {
        this.setState({currency: currency[0]});
        break;
      }
    }

    if (currency == null)
    {
      this.setState({currency: "£"});
    }
  }
  getChange = async () => 
  {

    const change = /(?:^|\W)((change)|(change due))(?:$|\W)/;
    var changeMatch = null;

    for (let i = 0; i < this.state.data.length; i++) 
    {
      changeMatch = this.state.data[i].match(change);
      if(changeMatch != null)
      {
        changeMatch  = this.state.data[i];
        this.state.data.length = i;
        changeMatch = String(changeMatch);  
        var doublenumber = changeMatch.match(/([+-]?\d+(\.\d+)?)/g);
        console.log("CHANGE == " + doublenumber);
        if(doublenumber != null)
        {
          this.setState({change: String(doublenumber)});
        }
        else
        {
          this.setState({change: changeMatch});
        }
        
        break;
      }
    }

    if(changeMatch == null)
    {
      this.setState({change: "0"});
      Alert.alert(
        "Change Not Found",
        "Please Enter The Change",
        [
           { text: "OK", onPress: () => console.log("OK Pressed") }
        ]
      );
      
    }

    
    
  }
  getTotal = async () => 
  {
    const total = /(?:^|\W)((balance)|(total)|(due)|(sub-total)|(sale)|(deficit))(?:$|\W)/;
    var totalMatch = null;

    for (let i = 0; i < this.state.data.length; i++) 
    {
      totalMatch = this.state.data[i].match(total);
      if(totalMatch != null)
      {
        totalMatch  = this.state.data[i];
        this.state.data.length = i;
        totalMatch = String(totalMatch);  
        var doublenumber = totalMatch.match(/([+-]?\d+(\.\d+)?)/g);
        console.log("TOTAL == " + doublenumber);
        this.setState({total: String(doublenumber)});
        break;
      }
    }
    if(totalMatch == null)
    {
      this.setState({total: "0"});
    }
   
    
  }
  getItems = async () => 
  {
    const currencyRegex = /[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6]/;
    var currency = null;
    var float = null;
    let j = 0;
    const map = [];
    let curItem;


  
    for(let i = 0; i < this.state.data.length; i++)
    {
      currency = this.state.data[i].match(currencyRegex);
      float = this.state.data[i].match(/([+-]?[0-9]+[.][0-9]*([e][+-]?[0-9]+)?)/g);

      if(currency != null || float != null)
      {
        curItem = String(this.state.data[i].replace(float,''));
        curItem = curItem.replace(currencyRegex,"");
        //remove currency if avaliable
        // makebuttons next to each other
        map[j] = {item: curItem ,price: float[0]};
        j++;
      }
    }
  
    if(map.length != 0)
    {
      this.setState({map: map});
    }
    else
    {
      map[0] = {item: "Not Found" ,price: "No Price"};
      this.setState({map: map});
    }
  }
  validateSave = async () => 
  {

    // CHECK ALL DATA BEFORE SENDING 

    //Date format , missing fields , incorrect total (add each item price to check if total is correct)
    
    this.sendToDB()
  }

  sendToDB = async () => 
  {

    const id = await AsyncStorage.getItem("@id");
    const photo = await this.props.route.params.imageData;

    return fetch(SERVER_IP+"addReceipt?id="+id+"&date="+this.state.date+"&total="+this.state.total+"&currency="+this.state.currency+"&change="+this.state.change+"&items="+JSON.stringify(this.state.map)+"&title="+this.state.title, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({image: photo})
    })
      .then((response) => {
        if (response.status == 200) {
          this.props.navigation.navigate("History");
      
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
      .catch((err) => {
        console.log(err);
      });

    //?id="+id+"&date="+this.state.date+"&total="+this.state.total+"&currency="+this.state.currency+"&change="+this.state.change+"&items="+JSON.stringify(this.state.map)+"&title="+this.state.title
  }

render(){
    return (
      
      <View style={{paddingHorizontal: 30,paddingTop: 50 , flex:1}}>

      <Text style={styles.title}>Edit & Save</Text>

        <TextInput
          label="Title"
          onChangeText={(title) => this.setState({ title })}
          value={this.state.title.toString()}
          style={Style.inputBox}
          theme={theme}
        />
      
       
        <TextInput
          onChangeText={(date) => this.setState({ date })}
          value={this.state.date.toString()}
          style={Style.inputBox}
          theme={theme}
          label="Date Of Purchase"
        />

        
        <TextInput
          onChangeText={(currency) => this.setState({ currency })}
          value={this.state.currency.toString()}
          style={Style.inputBox}
          theme={theme}
          label="Currency Type"
        />

        
        <TextInput
          onChangeText={(total) => this.setState({ total })}
          value={this.state.total.toString()}
          style={Style.inputBox}
          theme={theme}
          label="Total"
        />

       
        <TextInput
          onChangeText={(change) => this.setState({ change })}
          value={this.state.change.toString()}
          style={Style.inputBox}
          theme={theme}
          label="Change"
        />

      <FlatList
      style={{flex: 1}}
          data={this.state.map}
          keyExtractor={(item) => item.pirce}
          renderItem={({ item }) => {
            return (
              <Fragment>
                <View style={{flexDirection:"row"}}>
                  <View style={{flex:1}}>
                    <TextInput 
                    style={Style.inputBox}
                    theme={theme}
                    label="Item Name"
                    onChangeText={(item) => this.setState({ item })}
                    value={this.state.map}>
                      {item.item}
                    </TextInput>
                  </View>
                  <View style={{flex:1}}>
                    <TextInput 
                    style={Style.inputBox}
                    theme={theme}
                    label="Price"
                    onChangeText={(item) => this.setState({ item })}
                    value={this.state.map}>
                      {item.price}
                    </TextInput>
                  </View>
                </View>
                </Fragment>
            )
          }}
        />

          <Button
        title="Add Item"
        color="#00fa00"
        onPress={()=> this.setState({map: [...this.state.map, {item: "" ,price: ""}] })}
      />
      

      <Button
        title="Confirm"
        color="#00fa00"
        onPress={this.validateSave}
      />

      <Button
        title="Cancel"
        color="#ff0000"
        onPress={() =>  this.props.navigation.navigate('Camera')}
      />



      </View>
    )
  
}
}
export default Save;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  

  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    top: 0,
  },
});


