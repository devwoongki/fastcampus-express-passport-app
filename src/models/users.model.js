const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        minLength: 5
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    kakaoId: {
        type: String,
        unique: true,
        sparse: true
    },
    nickname: {
        type: String,
        minLength: 1
    },
    profile_image: {
        type: String,
        minLength: 5
    },
    thumbnail_image: {
        type: String,
        minLength: 5
    },
})

const saltRounds = 10;
userSchema.pre('save', function(next){
    let user = this;
    //비밀번호가 변경될때만
    if(user.isModified('password')){
        //salt생성
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err);

            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err);
                user.password =  hash;
                next();
            })
        })
    }else{
        next();
    }    
})

userSchema.methods.comparePassword = function(plainPassword, cb){
    //bcrypt compare 비교
    //plain password-> client, this.password > database
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

const User = mongoose.model('User', userSchema);

module.exports = User;