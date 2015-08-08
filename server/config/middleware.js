var morgan      = require('morgan'), // used for logging incoming request
    bodyParser  = require('body-parser'),
    helpers     = require('./helpers.js'); // our custom middleware


module.exports = function (app, express) {
  // Express 4 allows us to use multiple routers with their own configurations

  var userRouter = express.Router();
  // var linkRouter = express.Router();
  // var roomRouter = express.Router();

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));


  app.use('/api/users', userRouter); // use user router for all user request
  // app.use('/api/rooms', roomRouter); // use user router for all user request
  // authentication middleware used to decode token and made available on the request

  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);
  
  require('../users/userRoutes.js')(userRouter);

  // THESE ARE JUST HERE FOR REFERENCE
  // require('../links/linkRoutes.js')(linkRouter);
  // require('../room/roomRoutes.js')(roomRouter);
};
