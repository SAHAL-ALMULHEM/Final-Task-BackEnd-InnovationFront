const mongoose = require ('mongoose');
const bcrypt = require ('bcrypt');
const validator = require ('validator');
const crypto = require ('crypto');

const UserSchema = new mongoose.Schema({
firstname: {
    type: String,
    required: [true, 'first name is required'],
    validate:{
        validator: (v) => /^[a-zA-z]+$/.test(v),
        message: props => `${props.value} is not a valid first name, Only english letter`
    }

},
lastname: {
    type: String,
    required: [true, 'last name is required'],
    validate:{
        validator: (v) => /^[a-zA-z]+$/.test(v),
        message: props => `${props.value} is not a valid last name, Only english letter`
    }
},
    username: {
        type: String,
        required: [true, 'username is required'],
        unique: true,
        validate:{
            validator: (v) => /^[a-zA-z0-9]+$/.test(v),
            message: props => `${props.value} is not a valid username, Only english letter and numbers`
        }
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        validate:{
            validator: (v) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v),
            message: props => `${props.value} is not a valid password. It must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.`
        }
    },
    role: {
        type: String,
        enum: ['user','admin'],
        default: 'user'
    },

    resetPasswordToken: String,
    resetPasswordExpires: Date
});

UserSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew){
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

module.exports = mongoose.model('User',UserSchema);