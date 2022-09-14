import { StyleSheet, Text, View, SafeAreaView, Button, Image , TouchableOpacity } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Camera } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
//import ImagePickerComponent from "../ImagePickerComponent";
import gallery from '../icons/gallery.png'

import { shareAsync } from 'expo-sharing';
import helperFunctions from "../helperFunctions.js";
import * as MediaLibrary from 'expo-media-library';
import { config } from '../config.js'

const appHelper = require('../polyGroup');
const API_KEY = config.API_KEY; 
const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

export default function App({navigation}) {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flashMode, setFlashMode] = useState('off');

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
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const result = await response.json();

      const mergedArray = appHelper.initLineSegmentation(result.responses[0]);
  
      const lower = mergedArray.map(mergedArray => mergedArray.toLowerCase()); //lower case validation
    
  
      navigation.navigate("Save",{arrData: lower});
    
  
     
      
  
  
      return lower
        ? lower
        : { text: "This image doesn't contain any text!" };
    }
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        base64: true, //return base64 data.
        //this will allow the Vision API to read this image.
      });
      if (!result.cancelled) {
          //const responseData = await onSubmit(result.base64);
          console.log("hello?");
          console.log(result);
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
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        console.log("hllo???");
        callGoogleVisionAsync(photo.base64);
        setPhoto(undefined);
        
      });
    };

    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64 }} />
        {hasMediaLibraryPermission ? <Button title="Scan & Save" onPress={savePhoto} /> : undefined}
        <Button title="Discard" onPress={() => setPhoto(undefined)} />
      </SafeAreaView>
    );
  }

  return (
    <Camera flashMode={flashMode} type={cameraType} style={styles.container} ref={cameraRef}>

        <TouchableOpacity style=
        {{
          position: 'absolute',
          left: '7%',
          top: '7%',
          borderRadius: '50%',
          height: 40,
          width: 40, 
          backgroundColor: flashMode === 'off' ? '#000' : '#fff',
        }} 
        onPress={handleFlashMode}>

            <Text style={{fontSize: 30}}>
            ⚡️
            </Text>
        </TouchableOpacity>

      <View style={styles.buttonContainer}>

      <TouchableOpacity onPress={pickImage}>
        <Image source={gallery}/>
       </TouchableOpacity>

      <TouchableOpacity style={styles.cameraBtn} onPress={takePic} />
      <TouchableOpacity style={styles.flipBtn} onPress={switchCamera} />


      
        

      </View>

      <StatusBar style="auto" />
    </Camera>
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
    borderRadius: '50%',
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