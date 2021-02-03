/*
 * importing lib.. here
*/

const https = require("https");
const http = require("http");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const compression = require("compression")
const app = express();
const exphbs = require('express-handlebars');
const helmet = require('helmet')
const fs = require("fs");
const cors = require('cors');

/*
 * importing file here
*/

const { notificationCronjob } = require('./cronjob/notification')
const { initialSetupForDesignation, initialSetupForAdmin,
  initialSetupForSystemYear, createPasswordForBranch, createEmployeePackage } = require('./startup/initServer');
const { config: { PORT, DB, MODE }, logger: { logger } } = require("../config");
const { mountRoutes } = require("./routes");
const { oneDayCronJob } = require('./cronjob/oneDayCronjob')
const { StartBioStarServer } = require('./startup/bioServer')

/*
* ssl config
*/

const key = fs.readFileSync('./cert/privkey.pem', 'utf8');
const cert = fs.readFileSync('./cert/cert.pem', 'utf8');
const ca = fs.readFileSync('./cert/chain.pem', 'utf8');
const credentials = { key, cert, ca };


/*
* express middleware
*/

app.use(function (req, res, next) {
  let origin = req.headers.origin;
  res.header("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(cors())
app.use(helmet())
app.use(morgan("dev"));
app.use(compression())
app.use(bodyParser.json());
app.use(express.json());
app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use("/images", express.static("images"));


/**
 * play store policy
*/

app.get('/policy', (req, res, next) => {
  res.render('policy', { layout: false });
});



/**
 *  Main Routes
*/

mountRoutes(app);


/**
 * server setup
*/

mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true }).then(res => {
  console.log();
  console.log("successfully connected to MongoDB !! ")
  console.log();
  console.log("keep forward all setup is done !! :) :) :) ");
}).catch(err => {
  console.log("make sure mongo db service is on !!")
  console.log();
  console.log("or check config of mongo db running port !!  ");
  console.log();
  console.log("If you are still having trouble, try Googling for the key parts of the following error object before posting an issue");
  console.log(JSON.stringify(err));
  return process.exit(1);
});



/**
 * Production setup
*/



if (MODE === 'PROD') {
  app.use(express.static('build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}


/**
 * set environment variable to set alternate port automatically during production or deployment
 */


const port = process.env.PORT || PORT;

let httpsServer;
let httpServer;


if (MODE === 'PROD') {
  httpsServer = https.createServer(credentials, app);
  const io = require('./socket')(httpsServer, true);
  exports.io = io;
  httpsServer.listen(port, () => console.info(`welcome to Alnakheel :)  visit https://skoolgo.pixelmindit.com:${port}`)).on("error", (e) => {
    if (e.code === 'EADDRINUSE') {
      console.log();
      console.error('Address ' + port + ' already in use! You need to pick a different host and/or port.');
      console.log('Maybe schoolGo is already running?');
    }
    console.log();
    console.log('If you are still having trouble, try Googling for the key parts of the following error object before posting an issue');
    console.log(JSON.stringify(e));
    return process.exit(1);
  });
} else {
  httpServer = http.createServer(app);
  const io = require('./socket')(httpServer, false);
  exports.io = io;
  httpServer.listen(port, () => console.info(`welcome to Alnakheel :)  visit http://localhost:${port}`)).on("error", (e) => {
    if (e.code === 'EADDRINUSE') {
      console.log();
      console.error('Address ' + port + ' already in use! You need to pick a different host and/or port.');
      console.log('Maybe schoolGo is already running?');
    }
    console.log();
    console.log('If you are still having trouble, try Googling for the key parts of the following error object before posting an issue');
    console.log(JSON.stringify(e));
    return process.exit(1);
  });
}



/**
 * initial setup for designation, admin and current year
*/

initialSetupForDesignation()
  .then(() => {
    initialSetupForAdmin()
      .then(() => {
        console.log('successfully setup system admin 🚀');
      }).catch(err => {
        console.log(err);
      });
    initialSetupForSystemYear()
      .then(() => {
        console.log('successfully setup system year 🚀');
      }).catch(err => {
        console.log(err);
      });
    createPasswordForBranch()
      .then(() => {
        console.log('successfully start Bio Star Server 🚀');
      }).catch(err => {
        console.log(err);
      });
  }).catch(err => {
    console.log(err);
  });





if (MODE === 'PROD') {
  StartBioStarServer()
    .then(async () => {
      console.log('successfully start Bio Star Server 🚀');
    }).catch(err => {
      console.log(err);
    });
  createEmployeePackage().then(() => {
    console.log('successfully create Employee pa 🚀');
  }).catch(err => {
    console.log(err);
  });
}



/**
 * notification middleware
*/

notificationCronjob();

/**
 * cron jobs
*/

oneDayCronJob();



/**
 * uncaught Exception handler
*/

process.on('uncaughtException', err => {
  logger.error(err, 'Uncaught Exception thrown');
  process.exit(1);
});

