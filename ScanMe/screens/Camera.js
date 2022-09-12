import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, Image , TouchableOpacity } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Camera } from 'expo-camera';
import ImagePickerComponent from "../ImagePickerComponent";
import { shareAsync } from 'expo-sharing';
import callGoogleVisionAsync from "../helperFunctions.js";
import * as MediaLibrary from 'expo-media-library';

export default function App() {
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
        callGoogleVisionAsync(photo.base64);
        setPhoto(undefined);
        console.log("hllo???");
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
      <ImagePickerComponent onSubmit={callGoogleVisionAsync} />
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