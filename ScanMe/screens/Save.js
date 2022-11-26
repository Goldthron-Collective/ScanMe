import React, { Component,useEffect,useState  } from "react";
import { View,Text,StyleSheet,TextInput,TouchableOpacity,Image,FlatList ,Button } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SERVER_IP} from "../serverConnect"


class Save extends Component {
  constructor(props) {
    super(props);
      this.state = {
        data: '',
        date: '',
        currency: '',
        change: '',
        total: '',
        items: [],
        itemPrice: [],
        map: [],
      };
    }



async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {

    this.setState({data: this.props.route.params.arrData }, () => {
      this.getDate();
      this.getCurrency();
      this.getChange();
      this.getTotal();
      this.getItems();
    });
   

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
      //console.log(date);
      if(date != null)
      {
        date = this.state.data[i];
        //data.splice(i,1);
        break;
      }
      date = this.state.data[i].match(date2);
      //console.log(date);
      if(date != null)
      {
        date = this.state.data[i];
        //data.splice(i,1);
        break;
      }      
    }
    console.log("DATE == " + date);


    this.setState({date: date}, () => {
      console.log(" IT CHANGED ???");
      console.log(this.state.date);
    });


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
        //data.splice(i,1);
        break;
      }
    }
    console.log("CURRENCY == " + currency[0]);
    this.setState({currency: currency[0]});

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
        break;
      }
    }

    changeMatch = String(changeMatch);  
    var doublenumber = changeMatch.match(/([+-]?\d+(\.\d+)?)/g);
    console.log("CHANGE == " + doublenumber);
    this.setState({change: String(doublenumber)});
    
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

        break;
      }
    }
    
    totalMatch = String(totalMatch);  
    var doublenumber = totalMatch.match(/([+-]?\d+(\.\d+)?)/g);
    console.log("TOTAL == " + doublenumber);
    this.setState({total: String(doublenumber)});
    
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
        
        console.log(float);
        curItem = String(this.state.data[i].replace(float,''));
        map[j] = {item: curItem ,price: float[0]};
        j++;

        
       
      }
    }
  
    this.setState({map: map});
   
    //all data sent to front end in the form of editable form and then once all good sent to database
      

  }
  sendToDB = async () => 
  {

    const id = await AsyncStorage.getItem("@id");
    console.log(this.state.date);

    fetch(SERVER_IP+"addReceipt?id="+id+"&date="+this.state.date+"&total="+this.state.total+"&currency="+this.state.currency+"&change="+this.state.change+"&items="+JSON.stringify(this.state.map))
    .then(async(response) => {
      console.log(response);

      if (response.status == 200) {
         response.json().then(async(json) => {
            this.props.navigation.navigate("History");
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
  }

render(){
    return (
      
      <ScrollView style={{paddingHorizontal: 30,paddingTop: 50}}>

      <Text style={styles.title}>Edit & Save</Text>
      
       <Text>{"Date Of Purchase: "}</Text>
        <TextInput
          onChangeText={(date) => this.setState({ date })}
          value={this.state.date}
          style={styles.input}
        />

        <Text>{"Currency Type: "}</Text>
        <TextInput
          onChangeText={(currency) => this.setState({ currency })}
          value={this.state.currency}
          style={styles.input}
        />

        <Text>{"Total: "}</Text>
        <TextInput
          onChangeText={(total) => this.setState({ total })}
          value={this.state.total}
          style={styles.input}
        />

        <Text>{"Change: "}</Text>
        <TextInput
          onChangeText={(change) => this.setState({ change })}
          value={this.state.change}
          style={styles.input}
        />

      <Text>{"Items Purchased: "}</Text>

      <FlatList
          data={this.state.map}
          keyExtractor={(item) => item.pirce}
          renderItem={({ item }) => {
            return (
              <TextInput 
              style={styles.input}
              onChangeText={(item) => this.setState({ item })}
              value={this.state.map}>
                {item.item}
                {item.price}
              </TextInput>
            )
 
          }}
          
        />
      

      <Button
        title="Confirm"
        color="#00fa00"
        onPress={this.sendToDB}
      />

      <Button
        title="Cancel"
        color="#ff0000"
        onPress={() =>  this.props.navigation.navigate('Camera')}
      />



      </ScrollView>
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
  input:{
    height: 40,
    borderWidth: 1,
    color: "black",
    width: "95%",
    padding: 10,
    margin: 10,
  }
});


