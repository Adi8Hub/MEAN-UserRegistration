const mongoose = require('mongoose');
require('./user.model');
mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
  } ,(err) => {
    if(!err)
        console.log('DB connected..');
    else{
        console.log('Error in connection!!!' + JSON.stringify(err, undefined, 2));
    }
});