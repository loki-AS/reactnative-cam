import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Camera, CameraType } from 'expo-camera'
import * as MediaLibrary from "expo-media-library"
import { useEffect, useRef, useState } from 'react';
import Button from './src/components/Button';

export default function App() {
  const [camPermission, setCamPermission] = useState(null)
  const [image, setImage] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back)
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off)
  const cameraRef = useRef(null)

  const accessCam = async () => {
    MediaLibrary.requestPermissionsAsync()
    const cameraStatus = await Camera.requestCameraPermissionsAsync()
    setCamPermission(cameraStatus.status === 'granted');
  }

  useEffect(() => {
    accessCam()
  }, [])

  const takePicture = async() => {
    if(cameraRef){
      try {
        const data = await cameraRef.current.takePictureAsync()
        console.log(data)
        setImage(data.uri)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const saveImage = async() => {
    if(image){
      try {
        await MediaLibrary.createAssetAsync(image);
        alert('Picture saved 🎉')
        setImage(null)
      } catch (error) {
        console.log(error)
      }
    }
  }

  if(camPermission == false){
    return <Text>No access to camera</Text>
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {!image ? 
          <Camera
          style={styles.camera}
          type={type}
          flashMode={flash}
          ref={cameraRef}
          >
            <View
            style={{
              flexDirection:"row",
              justifyContent: "space-between",
              paddingHorizontal: 30,
            }}
            >
              <Button 
              icon={'retweet'} 
              onPress={() => {
                setType(type === CameraType.back ? CameraType.front : CameraType.back)
              }} />
              <Button 
              icon={'flash'} 
              color={flash === Camera.Constants.FlashMode.off ? 'gray' : '#f1f1f1'}
              onPress={() => {
                setFlash(flash === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off)
              }} />
            </View>
          </Camera>  
    : (
      <Image source={{uri:image}} style={styles.camera} />
    )}
      <View>
        {image ? (
          <View 
          style={{
            flexDirection:"row",
            justifyContent:"space-between",
            paddingHorizontal: 50
          }}
          >
            <Button title={"Re-take"} icon="retweet" onPress={() => setImage(null)} />
            <Button title={"Save"} icon="check" onPress={saveImage} />
          </View>
        ): (
          <Button 
          title={'Take a picture'}
          icon="camera"
          onPress={takePicture}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    paddingVertical:20
  },
  camera:{
    flex:1,
    borderRadius:20
  }
});
