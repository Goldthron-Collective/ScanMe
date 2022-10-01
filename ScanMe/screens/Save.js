import React, { Component,useEffect,useState  } from "react";
import { View,Text,StyleSheet,TextInput,TouchableOpacity,Image  } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';


  /* 

    find date
    find total and remove everthing after that in array
    find currency
    find money in total using currency 
    find each item and hashmap key/value pair for item/price

  */



export default function Save({route}){

  

  /*
 const [date, setDate] = useState('');
 const [currency, setCurrency] = useState('');
 const [change, setChange] = useState('');
 const [total, setTotal] = useState('');

            <Text style={styles.title}>{date}</Text>
          <Text style={styles.title}>{currency}</Text>
          <Text style={styles.title}>{total}</Text>
          <Text style={styles.title}>{change}</Text>
*/
  

  
  let data = route.params.arrData;
 

  useEffect(() => {

    data = route.params.arrData;

    _retrieveData();
    getDate();
});

_retrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem('@data');
    if (value !== null) {
      // We have data!!
      console.log(value);
    }
  } catch (error) {
    // Error retrieving data
    console.log(error);
  }
};
  function getDate()
  {
    const date1 = /\d{2}([\/.-])\d{2}\1\d{4}/;
    const date2 = /(?:^|\W)(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|(nov|dec)(?:ember)?)(?:$|\W)/;
    var date = null;
    //get the date

    for(let i = 0; i < data.length; i++)
    {
      date = data[i].match(date1);
      //console.log(date);
      if(date != null)
      {
        date = data[i];
        //data.splice(i,1);
        break;
      }
      date = data[i].match(date2);
      //console.log(date);
      if(date != null)
      {
        date = data[i];
        //data.splice(i,1);
        break;
      }      
    }
    console.log("DATE == " + date);
   
    getCurrency();
    //setDate(date);

  }
  function getCurrency()
  {
    const currencyRegex = /[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6]/;
    var currency = null;

    for(let i = 0; i < data.length; i++)
    {
      currency = data[i].match(currencyRegex);
     
      if(currency != null)
      {
        //data.splice(i,1);
        break;
      }
    }
    console.log("CURRENCY == " + currency[0]);
    getChange();

  }
  function getChange()
  {
    /*

    finding change (last thing)

    */
    const change = /(?:^|\W)((change)|(change due))(?:$|\W)/;
    var changeMatch = null;

    for (let i = 0; i < data.length; i++) 
    {
      changeMatch = data[i].match(change);
      if(changeMatch != null)
      {
        changeMatch  = data[i];
        data.length = i;
        break;
      }
    }

    changeMatch = String(changeMatch);  
    var doublenumber = changeMatch.match(/(?<=^| )\d+\.\d+(?=$| )/g);
    console.log("CHANGE == " + doublenumber);
    getTotal();
  }
  function getTotal()
  {
    /*

    finding total (last thing)

    */
    const total = /(?:^|\W)((balance)|(total)|(due)|(sub-total)|(sale)|(deficit))(?:$|\W)/;
    var totalMatch = null;

    for (let i = 0; i < data.length; i++) 
    {
      totalMatch = data[i].match(total);
      if(totalMatch != null)
      {
        totalMatch  = data[i];
        data.length = i;

        break;
      }
    }
    
    totalMatch = String(totalMatch);  
    var doublenumber = totalMatch.match(/(?<=^| )\d+\.\d+(?=$| )/g);
    console.log("TOTAL == " + doublenumber);

    getItems();
  }
  function getItems()
  {
    const items = [];

    const currencyRegex = /[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6]/;
    var currency = null;
  
    for(let i = 0; i < data.length; i++)
    {
      currency = data[i].match(currencyRegex);
      if(currency != null)
      {
        items.push(data[i]);
      }
    }
   
    console.log(items);

    //convert array into hashmap (key == item name | value == cost)
    //all data sent to front end in the form of editable form and then once all good sent to database
      

  }



    return (
      <View style={styles.container}>

         

      </View>
    )
  
}

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


