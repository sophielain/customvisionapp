const express = require('express');
const app = express();

// Route for the root path (/)
app.get('/', (req, res) => {
  res.send('<h1>App Working</h1>');
});

const PORT = process.env.PORT || 5004;

// Start the server
app.listen(PORT, () => console.log('App listening on PORT ${PORT}...'));

//Required Node Modules

const util=require('util')

const fs=require('fs')

const trainAPI=require('@azure/cognitiveservices-customvision-training')

const predAPI=require('@azure/cognitiveservices-customvision-prediction')

const msREST=require('@azure/ms-rest-js')

const publishIterationName="Iteration1"

const setTimeOutPromise=util.promisify(setTimeout)

const body_parser=require('body-parser')

const fileUpload=require('express-fileupload')

const dotenv=require('dotenv')

//configure environment

dotenv.config()

//variables

const trainer_endpoint=process.env.resourceTrainingENDPOINT

const pred_endpoint=process.env.resourcePredictionENDPOINT

const creds=new msREST.ApiKeyCredentials({inHeader:{'Training-key':process.env.resourceTrainingKEY}})

const trainer=new trainAPI.TrainingAPIClient(creds,trainer_endpoint)

const pred_creds=new msREST.ApiKeyCredentials({inHeader:{'Prediction-key':process.env.resourcePredictionKEY}})

const pred=new predAPI.PredictionAPIClient(pred_creds,pred_endpoint)



let projectID=''

//create a variable to your image folder

const rootImgFolder='./public/images'

const multer=require('multer')


const storage = multer.diskStorage({

    destination: (req, file, cb) => {

      cb(null, 'uploads/'); // Set the directory where uploaded files will be stored

    },

    filename: (req, file, cb) => {

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());

    },

});

const upload=multer({dest:'uploads/',storage:storage})

//sets the default view engine to ejs

app.set('view engine','ejs')

//that handles json data

app.use(body_parser.urlencoded({extended:true}))

//default file for all static assets e.g. pictures, css

app.use(express.static('public'))

//index page

app.get('/',(req,res)=>{

    res.render('index')

})

//create new project

app.get('/create-train-project', (req,res)=>{

    res.render('create')

})



//classify image

app.get('/classify-image', (req,res)=>{

    // Read the JSON file

    fs.readFile('id.json', 'utf8', (err, data) => {

        if (err) {

            console.error(err);

            return res.status(500).send('Error reading JSON file');

        }

        const projectsData = JSON.parse(data);

        let pred_results=[]

        // Pass the projectsData to the EJS template

        res.render('classify', { projects: projectsData.projects,pred_results:pred_results });

    });

   

})