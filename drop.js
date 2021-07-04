import React, {useCallback, useEffect} from 'react'
import {useDropzone} from 'react-dropzone'

import firebase from 'firebase'
firebase.initializeApp({
    apiKey: "AIzaSyAcC9OhWMoVvr_q58lmobGTDK7ajuOjwlE",
    authDomain: "image-uploader-111.firebaseapp.com",
    databaseURL: "https://image-uploader-111-default-rtdb.firebaseio.com",
    projectId: "image-uploader-111",
    storageBucket: "image-uploader-111.appspot.com",
    messagingSenderId: "884169668235",
    appId: "1:884169668235:web:3fa9a798d21403ac22868e",
    measurementId: "G-DE0MKBLVKL"
  });
firebase.analytics();

function Drop() {
    useEffect(()=>{
        let input = document.getElementById('inp');
        input.addEventListener('change', ()=>{handleSubmit(input.files[0])});
    })
const handleSubmit = (imageFile) => {
        var storage = firebase.storage();
        const imageUpload = storage.ref(`images/${imageFile.name}`).put(imageFile);
        imageUpload.on(
          'state_changed',
          (snapshot) => {
            //process fun here  
              console.log(snapshot);
            },
          (error) => {
             //error fun here 
              console.log(error);       
            },
          () => {
            storage
              .ref('images')
              .child(imageFile.name)
              .getDownloadURL()
              .then((url) => {
                console.log(url);            
              });
            }
           );
};

const onDrop = useCallback((file) => {
      file=file[0]
      handleSubmit(file)

  }, [])

  const {getRootProps, getInputProps} = useDropzone({onDrop})

  

  return (
      <>
      <input type='file' id='inp' className='input' accept=".jpg, .jpeg, .png, .svg"></input>
      </>
  )
}

export default Drop
{/*<div {...getRootProps()}>
  <input {...getInputProps()} />
  <p>Drag 'n' drop some files here, or click to select files</p>
</div>*/}