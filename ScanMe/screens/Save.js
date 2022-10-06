import React, { Component,useEffect,useState  } from "react";
import { View,Text,StyleSheet,TextInput,TouchableOpacity,Image,FlatList  } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { render } from "react-dom";


  /* 

    find date
    find total and remove everthing after that in array
    find currency
    find money in total using currency 
    find each item and hashmap key/value pair for item/price
    <Text style={styles.title}>{dates}</Text>
          <Text style={styles.title}>{currencys}</Text>
          <Text style={styles.title}>{totals}</Text>
          <Text style={styles.title}>{changes}</Text> 
          const [dates, setDate] = useState('');
 const [currencys, setCurrency] = useState('');
const [changes, setChange] = useState('');
 const [totals, setTotal] = useState('');

  */

class Save extends Component {
  constructor(props) {
    super(props);
      this.state = {
        data: '',
        date: 'date',
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
    var item = null;
    const items = []
    const price = []
    let j = 0;
    const map = [];


  
    for(let i = 0; i < this.state.data.length; i++)
    {
      currency = this.state.data[i].match(currencyRegex);
      float = this.state.data[i].match(/([+-]?[0-9]+[.][0-9]*([e][+-]?[0-9]+)?)/g);

     
      

      if(currency != null || float != null)
      {
        
        console.log(float);
        item = String(this.state.data[i].replace(float,''));
        map[j] = {ited: item ,price: float[0]};
        j++;

        
       
      }
    }
  
    this.setState({map: map});
   
    //all data sent to front end in the form of editable form and then once all good sent to database
      

  }


render(){
    return (
      <View style={styles.container}>

        

        <TextInput
          onChangeText={(date) => this.setState({ date })}
          value={this.state.date}
        />

        <TextInput
          onChangeText={(currency) => this.setState({ currency })}
          value={this.state.currency}
        />

        <TextInput
          onChangeText={(change) => this.setState({ change })}
          value={this.state.change}
        />

        <TextInput
          onChangeText={(total) => this.setState({ total })}
          value={this.state.total}
        />

      
       

      {this.state.map.map((item) => (
        <Text key={item.ited}>{item.ited} {item.price}</Text>
      ))} 

      </View>
    )
  
}
}
export default Save;
/*
 {this.state.items.map((item, key)=>(
         <Text key={key}> { item } </Text>)
         )}
<TouchableOpacity
<Text>{item.price}</Text>
        <FlatList
        
          data={this.state.itemsLS}
          renderItem={({ item }) => (
            <View>
            
              </View>
          )}
          keyExtractor={(item, index) => item.item}
        />
                onPress={() =>
                  this.props.navigation.navigate("Profile", {
                    id: String(item.user_id),
                  })
                }
                style={Style.buttonStyleDefault}
              >
                <Text style={Style.buttonText}>
                  {item.user_givenname + " " + item.user_familyname}
                </Text>]
                 {this.state.items}
         {this.state.itemPrice}
              </TouchableOpacity>
*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});


