import { StyleSheet, View, SafeAreaView, Image , TouchableOpacity } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Style from "./Style";

import { Buffer } from "buffer";
import {SERVER_IP} from "../serverConnect"

import { Camera } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
//import ImagePickerComponent from "../ImagePickerComponent";
import gallery from '../icons/gallery.png'
import { Button, Dialog, Portal, Provider, Text } from 'react-native-paper';

import { shareAsync } from 'expo-sharing';
import helperFunctions from "../helperFunctions.js";
import * as MediaLibrary from 'expo-media-library';
import { config } from '../config.js'

const appHelper = require('../polyGroup');
const API_KEY = config.API_KEY; 
const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;
let photos = "";

//compress photo to under 1mb
//dected location of recript and only scan that part and ignore backgroun (same with photos)


export default function App({navigation}) {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();
  
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState('off');

  const [isDialogVisible, setIsDialogVisible] = useState(false);

  

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted. Please change this in settings.</Text>
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };
  function generateBody(image) {
    const body = {
      requests: [
        {
          image: {
            content: image,
          },
          features: [
            {
              type: 'TEXT_DETECTION', //we willl use this API for text detection purposes.
              maxResults: 1,
            },
          ],
        },
      ],
    };
    return body;
  }
  
  let callGoogleVisionAsync = async (image) => {
      const body = generateBody(image); //pass in our image for the payload
      const id = await AsyncStorage.getItem("@id");

      try{
        return fetch(SERVER_IP+"incrementAccount?id="+id, {
          method: "POST",
          headers: { "Content-Type": "application/json"},
        }).then(async (response) =>{
          if(response.status == '400')
          {
            setIsDialogVisible(true);
            console.log("CAUGHT");
            

          }
          else if(response.status == '200')
          {
            await fetch(API_URL, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            }).then((response) => {
              if(response.status == '200')
              {
                console.log("Sent To Goole");
      
                response.json().then(async(json) => {
                
                const mergedArray = appHelper.initLineSegmentation(json.responses[0]);
        
                const lower = mergedArray.map(mergedArray => mergedArray.toLowerCase()); //lower case validation
          
                navigation.navigate("Save",{arrData: lower,imageData: photos});
                });
              }
              else
              {
                return lower ? lower: { text: "This image doesn't contain any text!" };
      
              }
            })
            .catch((err) => {
              console.log(err);
            });
          }
        })
      }
      catch
      {
        return;
      }

      
  
     
    }
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        base64: true, //return base64 data.
        //this will allow the Vision API to read this image.
      });
      if (!result.cancelled) {
    
          photos = result.base64;

          console.log("sending to next screen.....");
          
          callGoogleVisionAsync(result.base64);
        }
     
    };
  const switchCamera = () => {
    if (cameraType === 'back') {
      setCameraType('front')
    } else {
      setCameraType('back')
    }
  }
  const handleFlashMode = () => {
    if (flashMode === 'on') {
      setFlashMode('off')
    } else if (flashMode === 'off') {
      setFlashMode('on')
    } else {
      setFlashMode('auto')
    }

  }


  if (photo) {

    let savePhoto = () => {

      photos = photo.base64;
      
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        
       
        callGoogleVisionAsync(photo.base64);
        setPhoto(undefined);
        
      });
    };

    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64 }} />
  
      <View style={{flexDirection: 'row'}}> 
        {hasMediaLibraryPermission ? <TouchableOpacity
            style={Style.buttonStyleDefault}
            onPress={savePhoto}
          >
            <Text style={Style.buttonText}>Scan & Save</Text>
          </TouchableOpacity>  : undefined}

        <TouchableOpacity
            style={Style.buttonStyleDefault}
            onPress={() => setPhoto(undefined)}
          >
            <Text style={Style.buttonText}>Discard</Text>
          </TouchableOpacity>
      </View>

      </SafeAreaView>
    );
  }

  return (
    <Provider>
    <Camera flashMode={flashMode} type={cameraType} style={styles.container} ref={cameraRef}>

        <TouchableOpacity style=
        {{
          position: 'absolute',
          left: '7%',
          top: '7%',
          borderRadius: 50,
          height: 40,
          width: 40, 
          backgroundColor: flashMode === 'off' ? '#000' : '#fff',
        }} 
        onPress={handleFlashMode}>

            <Text style={{fontSize: 30}}>
            ⚡️
            </Text>
        </TouchableOpacity>

       
      
      <Portal>
          <Dialog
            visible={isDialogVisible}
            onDismiss={() => setIsDialogVisible(false)}>
            <Dialog.Title>Wait hang on!</Dialog.Title>
            <Dialog.Content>

              <Text variant="bodyMedium">You have reached the free tier limit, Please buy premium for more scans</Text>


            </Dialog.Content>
            <Dialog.Actions>

            <TouchableOpacity
            style={Style.buttonStyleDefault}
            onPress={() => setIsDialogVisible(false)}
          >
            <Text style={Style.buttonText}>Ok</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={Style.buttonStyleDefault}
            onPress={() => setIsDialogVisible(false)}
          >
            <Text style={Style.buttonText}>Cancel</Text>
          </TouchableOpacity>

            </Dialog.Actions>
          </Dialog>
        </Portal>
        


       

      <View style={styles.buttonContainer}>

      
      

      <TouchableOpacity onPress={pickImage}>
        <Image source={gallery}/>
       </TouchableOpacity>

      <TouchableOpacity style={styles.cameraBtn} onPress={takePic} />
      <TouchableOpacity style={styles.flipBtn} onPress={switchCamera} />
        

      </View>

      <StatusBar style="auto" />
    </Camera>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flashBtn:{

  },
  cameraBtn:{
      width: 70,
      height: 70,
      bottom: 0,
      borderRadius: 50,
      backgroundColor: '#fff',
  },
  flipBtn: {
    marginTop: 20,
    borderRadius: 50,
    height: 25,
    width: 25,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    padding: 15,
    justifyContent: 'space-between'
  },
  buttonSubContain: {
    alignSelf: 'center',
     flex: 1,
     alignItems: 'center'
   },
  preview: {
    alignSelf: 'stretch',
    flex: 1
  }
});