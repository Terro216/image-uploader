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
  CardActions, 
  Slide,
  LinearProgress,
  TextField,
  CardMedia,
  Container,
  Button
} from "@material-ui/core"
import firebase from "firebase"

firebase.initializeApp({
  apiKey: 'AIzaSyAcC9OhWMoVvr_q58lmobGTDK7ajuOjwlE',
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

const useStyles = makeStyles((theme)=>({
  wrapper: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card1: {
    width: "50%",
    height: "60%"
  },
  card2: {
    width: '30%',
    height: '35%'
  },
  card3: {
    width: "60%",
    height: "75%",
    margin:'0 auto',
    display:'flex',
    justifyContent:'space-around',
    alignItems:'center',
    flexDirection: 'column',
  },
  title: {
    textAlign: "center",
  },
  sub: {
    textAlign: "center",
  },
  progress: {
    marginTop: '50%'
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
    background: "#2F80ED",
    borderRadius: "8px",
    color: "white",
    padding: "3%",
  },
  hidden: {
    display:'none'
  },
  mediaImgWrapper: {
    marginTop:'5%',
    width:'60vw',
    height:'50vh'
  },mediaImg: {
    maxHeight: "100%",
    maxWidth: "100%",
    borderRadius: '20px',
    objectFit:'contain'
  },
  textLink: {
    width:'100%',
    display:'flex',
    justifyContent:'center',
    alignItems: 'center'
  }

}))

function App() {
  const classes = useStyles()
  const [stage, changeStage] = useState({
  card1: {
    in: true,
    direction: 'right'
  }, card2: {
    in: false,
    direction: 'right'
  }, card3: {
    in: false,
    direction: 'right'
  }
})

  function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
  }
  function highlightToggle(e) {
    let dropArea = document.getElementById("drop-area")
    dropArea.classList.toggle("highlight")
  }
  function getFiles(e) {
    //console.log(e)
    let files = e.target.files || e.dataTransfer.files
    //let length = files.length<=20?files.length:20
    changeStage({
    card1: {
      in: false,
      direction: 'left'
    }, card2: {
      in: true,
      direction: 'right'
    }, card3: {
      in: false,
      direction: 'right'
    }
  })
  document.getElementById('card1').style.display='none'
    //for (let i = 0; i < length; i++) {
    handleSubmit(files[0])
  }

  useEffect(() => {
    let dropArea = document.getElementById("drop-area")
    let input = document.getElementById("inp")

    dropArea.addEventListener(
      "dragenter",
      (e) => {
        preventDefaults(e)
        highlightToggle(e)
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
        highlightToggle(e)
      },
      false
    )
    dropArea.addEventListener(
      "drop",
      (e) => {
        preventDefaults(e)
        highlightToggle(e)
        getFiles(e)
      },
      false
    )

    input.addEventListener("change", (e)=>{getFiles(e)}, false)

  })

  const handleSubmit = (imageFile) => {
    const imageUpload = storage.ref(`images/${imageFile.name}`).put(imageFile)
    imageUpload.on(
      "state_changed",
      (snapshot) => {
        //process here
        //console.log(snapshot)
      },
      (error) => {
        //error here
        //console.log(error)
      },
      () => {
        storage
          .ref("images")
          .child(imageFile.name)
          .getDownloadURL()
          .then((url) => {
            changeStage({
            card1: {in:false,direction:'right'},
            card2: {
              in: false,
              direction: 'left'
            },
            card3: {
              in: true,
              direction:'right'
            }
          })
            document.getElementById('link').value=url
            document.getElementById('img').src=url
          })
      }
    )
  }

  return (
    <Container className={classes.wrapper}>
    <Slide direction={stage.card1.direction} id='card1' in={stage.card1.in} >
        <Card className={classes.card1} >
          <CardContent>
            <Typography
              className={classes.title}
              variant="h4"
              color="textPrimary">
              Upload Your Image
            </Typography>
            <Typography
              className={classes.sub}
              color="textSecondary"
              variant="subtitle1">
              jpg, jpeg, png, etc.
            </Typography>
          </CardContent>
          <CardActionArea>
            <label htmlFor="inp" className={classes.fileLabel}>
              <input
                type="file"
                id="inp"
                className={classes.hidden}
                accept="image/*"
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
</Slide>
<Slide direction={stage.card2.direction}  in={stage.card2.in} mountOnEnter unmountOnExit>
        <Card className={classes.card2} id='card2'>
          <CardContent>
        <Typography variant="body1" color="textPrimary" className={classes.title}>Uploading...</Typography>
        <LinearProgress className={classes.progress}/>
          </CardContent>

        </Card>
        </Slide>

<Slide direction={stage.card3.direction} id='card3' in={stage.card3.in} mountOnEnter unmountOnExit>
        
        <Card className={classes.card3}>
        <CardContent>
          <Typography className={classes.title}
              variant="h4"
              color="textPrimary" className={classes.title}>Uploaded Successfully!</Typography>
            <Container className={classes.mediaImgWrapper}><CardMedia
            className={classes.mediaImg}
            component="img"
            image=""
            title="Photo"
            id='img'
            /></Container></CardContent>
            <CardActions 
            className={classes.textLink}>
            <TextField
            id="link"
            label="Link"
            defaultValue="Your link should be here"
            InputProps={{
              readOnly: true,
            }}
            />
            <Button variant="contained" color="primary" id='copy' className={classes.copy} onClick={() => {
              navigator.clipboard.writeText(document.getElementById('link').value)
              document.getElementById('copy').innerText='Copied!'}}>Copy</Button>
        </CardActions>
        </Card>
</Slide>
    </Container>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
