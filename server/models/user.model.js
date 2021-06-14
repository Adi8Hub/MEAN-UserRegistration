const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required: 'Full name can\'t be empty'
    },
    email:{
        type:String,
        required: 'email can\'t be empty',
        unique: true,
        

    },
    password:{
        type:String,
        required: 'Password can\'t be empty',
        minlength: [4, 'Password must be atleast 4 characters long']

    },
    saltSecret: String
    
});

//CUstom validation for email
userSchema.path('email').validate(val=> {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');



//Events
userSchema.pre('save', function(next)  { 
     bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(this.password, salt,(err,hash)=> {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});


// Methods
userSchema.methods.verifyPassword = function(password){
                        //(plain password,encrypted password stored in DB)
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateJwt = function(){
    return jwt.sign(
        { _id: this._id },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXP
        }
        );
}



userSchema.plugin(uniqueValidator);
mongoose.model('User', userSchema);
