import React from 'react'
import ReactDOM from 'react-dom'
import './app.scss'
import { makeStyles, Box, Card, CardContent, Typography,CardActionArea, Button } from '@material-ui/core';
import Dropzone from 'react-dropzone'
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

var storageRef = firebase.storage().ref();

const useStyles = makeStyles({
    wrapper: {
        width:'100vw',
        height:'100vh',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        overflow:'hidden'
    },
    root: {
      minWidth: '30%',
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  });

function App() {
    const classes = useStyles();

    const handleSubmission = (file) => {
		const formData = new FormData();

		formData.append('File', file);
        let f=new Blob(file)
		storageRef.child(`${file.name}`).put({f
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
	};

    return(
        <div className={classes.wrapper} >
            <Card className={classes.root}> 
                <CardContent>
                    <Typography className={classes.title} component='h1' color='textPrimary'>
                        Upload Your images
                    </Typography>
                    <Typography className={classes.pos} color='textSecondary'>
                        Jpg,png,etc
                    </Typography>
                </CardContent>
                
                <CardActionArea>
                    <Dropzone onDrop={(acceptedFiles) => {handleSubmission(acceptedFiles)}}>
  {({getRootProps, getInputProps}) => (
    <section>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
    </section>
  )}
</Dropzone>
                </CardActionArea>
            </Card>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'))