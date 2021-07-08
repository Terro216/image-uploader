import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import "./app.scss"
import {
  makeStyles,
  Box,
  Card,
  CardContent,
  Typography,
  CardActionArea,
} from "@material-ui/core"
import firebase from "firebase"
import API from "./api.js"

firebase.initializeApp({
  apiKey: API,
  authDomain: "image-uploader-111.firebaseapp.com",
  databaseURL: "https://image-uploader-111-default-rtdb.firebaseio.com",
  projectId: "image-uploader-111",
  storageBucket: "image-uploader-111.appspot.com",
  messagingSenderId: "884169668235",
  appId: "1:884169668235:web:3fa9a798d21403ac22868e",
  measurementId: "G-DE0MKBLVKL",
})
firebase.analytics()

const storage = firebase.storage()

const useStyles = makeStyles({
  wrapper: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "40%",
    height: "60%",
  },
  title: {
    textAlign: "center",
  },
  sub: {
    textAlign: "center",
  },
  hide: {
    display: "none",
  },
  fileLabel: {
    height: "100%",
    padding: "10%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  dragdrop: {
    padding: "10%",
    background: "#F6F8FB",
    border: "1px dashed #97BEF4",
    borderRadius: "12px",
  },
  choose: {
    padding: "10px",
    background: "#2F80ED",
    borderRadius: "8px",
    color: "white",
    padding: "5%",
  },
  show: {
    animationName:'$show',
  },
  hide: {
    animationName:'$hide',
  },
  hidden: {
    display: 'none'
  },
  '@keyframes show': {
    from: {x: -10000},
    to: {x: 0}
  },
  '@keyframes hide': {
    from: {opacity: 0},
    to: {opacity: 1}
  },
})

function App() {
  const classes = useStyles()
  const [stage,changeStage] = useState(0)

  function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
  }
  function highlight(e) {
    let dropArea = document.getElementById("drop-area")
    dropArea.classList.toggle("highlight")
  }
  function unhighlight(e) {
    let dropArea = document.getElementById("drop-area")
    dropArea.classList.toggle("highlight")
  }
  function getFiles(e) {
    console.log(e)
    let files = e.target.files || e.dataTransfer.files
    changeStage(2)
    document.getElementById('card1').classList.add('hide')
    for (let i = 0; i < files.length; i++) {
      handleSubmit(files[i])
    }
  }

  useEffect(() => {
    let dropArea = document.getElementById("drop-area")
    let input = document.getElementById("inp")

    dropArea.addEventListener(
      "dragenter",
      (e) => {
        preventDefaults(e)
        highlight(e)
      },
      false
    )
    dropArea.addEventListener(
      "dragover",
      (e) => {
        preventDefaults(e)
      },
      false
    )
    dropArea.addEventListener(
      "dragleave",
      (e) => {
        preventDefaults(e)
        unhighlight(e)
      },
      false
    )
    dropArea.addEventListener(
      "drop",
      (e) => {
        preventDefaults(e)
        unhighlight(e)
        getFiles(e)
      },
      false
    )

    input.addEventListener("change", (e)=>{getFiles(e)}, false)

    document.getElementById('card1').classList.add('show')

  })
  const handleSubmit = (imageFile) => {
    const imageUpload = storage.ref(`images/${imageFile.name}`).put(imageFile)
    imageUpload.on(
      "state_changed",
      (snapshot) => {
        //process fun here
        console.log(snapshot)
      },
      (error) => {
        //error fun here
        console.log(error)
      },
      () => {
        storage
          .ref("images")
          .child(imageFile.name)
          .getDownloadURL()
          .then((url) => {
            console.log(url)
          })
      }
    )
  }

  return (
    <div className={classes.wrapper}>
        <Card className={classes.card} id='card1'> 
          <CardContent>
            <Typography 
              className={classes.title}
              variant="h4"
              color="textPrimary">
              Upload Your images
            </Typography>
            <Typography
              className={classes.sub}
              color="textSecondary"
              variant="subtitle1">
              jpg, jpeg, png, etc
            </Typography>
          </CardContent>
          <CardActionArea>
            <label htmlFor="inp" className={classes.fileLabel}>
              <input
                type="file"
                id="inp"
                className={classes.hide}
                accept="image/*"
                multiple
              />
              <Box id="drop-area" className={classes.dragdrop}>
                Drag and Drop your image here
              </Box>
              <Typography variant="subtitle1">or</Typography>
              <Typography variant="body1" className={classes.choose}>
                Choose a file
              </Typography>
            </label>
          </CardActionArea>
        </Card>

        <Card className={classes.card,classes.hidden} id='card2'>
          card2
        </Card>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
