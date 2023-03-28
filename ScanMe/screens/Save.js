import React, { Component , Fragment} from "react";
import { View,Text,StyleSheet,FlatList ,Button } from "react-native";
import Style from "./Style";
import { config } from '../config.js'
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
        date: "Loading",
        currency: "Loading",
        change: "Loading",
        total: "Loading",
        items: [],
        itemPrice: [],
        map: [],
        title: "Untitled Recipt",
        loading: true,
        time: ""
      };
    }



async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", async() => {
      //Add loading screen until its done!
      await this.parseData()
     
  });
  }
async componentWillUnmount() {
  this.unsubscribe();
}

  parseData = async () => {
 
    const dateRgx = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    const timeRgx = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]|$/;
    const currencyRegex = /[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6]/;
    const change = /(?:^|\W)((change)|(change due))(?:$|\W)/;
    const total = /(?:^|\W)((balance)|(total)|(due)|(sub-total)|(sale)|(deficit))(?:$|\W)/;

    var currency2 = null;
    var float = null;
    let j = 0;
    const map = [];
    let curItem;

    var totalMatch = null;
    var changeMatch = null;
    var currency = null;
    var time = null;
    var date = null;
   

    for(let i = 0; i < this.state.data.length; i++)
    {
      date = this.state.data[i].match(dateRgx);

      if(date != null )
      {

        date = date[0];
      }

      time = this.state.data[i].match(timeRgx);

      if(time != null)
      {
        time = time[0];
      }

      currency = this.state.data[i].match(currencyRegex);
     
      if(currency != null)
      {
        this.setState({currency: currency[0]});
      }

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
       
      }


   
      totalMatch = this.state.data[i].match(total);

      if(totalMatch != null)
      {
        totalMatch  = this.state.data[i];
        this.state.data.length = i;
        totalMatch = String(totalMatch);  
        var doublenumber = totalMatch.match(/([+-]?\d+(\.\d+)?)/g);
        this.setState({total: String(doublenumber)});
        break;
      }

      currency2 = this.state.data[i].match(currencyRegex);
      float = this.state.data[i].match(/([+-]?[0-9]+[.][0-9]*([e][+-]?[0-9]+)?)/g);

      if(currency2 != null || float != null)
      {
        curItem = String(this.state.data[i].replace(float,''));
        curItem = curItem.replace(currencyRegex,"");
        //remove currency if avaliable
        // makebuttons next to each other
        map[j] = {item: curItem ,price: float[0]};
        j++;
      }

    }


    if(totalMatch == null)
    {
      this.setState({total: "0"});
    }

    if(changeMatch == null)
    {
      this.setState({change: "0"});
     
    }


    if (currency == null)
    {
      this.setState({currency: "£"});
    }
    
    
    if (date == null)
    {
      date = new Date().toLocaleDateString();
    }

    if (time == null)
    {
      time =  new Date().toLocaleTimeString();
    }

     this.setState({date: date + " " + time})
       
    
      if(map.length != 0)
      {
        
        this.setState({map: map});
        
      }
      else
      {
        map[0] = {item: "Not Found" ,price: "No Price"};
        this.setState({map: map});
      }
  
      this.setState({loading: false});

    return;

  }

    //Date format , missing fields , incorrect total (add each item price to check if total is correct)
    
   

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
  if (this.state.loading == true) {
    return (
      <View style={Style.container}>

          <Text style={{fontSize: 30,fontWeight: 'bold'}}>Loading...</Text>


        </View>
    )
  }
    return (
      
      <View style={{paddingHorizontal: 30,paddingTop: 50 , flex:1}}>

      <Text style={Style.title}>Edit & Save</Text>

 

      <FlatList
      style={{flex: 1}}
          data={this.state.map}
          keyExtractor={(item) => item.item}
          ListHeaderComponent={
            <View>

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
                
            </View>
          }
          renderItem={({ item,index }) => {
            return (
              <Fragment>
                <View style={{flexDirection:"row"}}>
                  <View style={{flex:1}}>
                    <TextInput 
                    style={Style.inputBox}
                    theme={theme}
                    label="Item Name"
                    onChangeText={text => {
                      this.state.map[index].item = text;
                      this.setState({item});
                    }}
                    value={this.state.map[index].item}>
                    </TextInput>
                  </View>
                  <View style={{flex:1}}>
                    <TextInput 
                    style={Style.inputBox}
                    theme={theme}
                    label="Price"
                     onChangeText={text => {
                      this.state.map[index].price = text;
                      this.setState({item});
                    }}
                    value={this.state.map[index].price}>


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
        onPress={()=> this.sendToDB()}
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


