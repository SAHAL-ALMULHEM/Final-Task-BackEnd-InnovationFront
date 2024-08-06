const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require ('crypto');
const nodemailer = require ('nodemailer');
const dotenv = require('dotenv'); 
dotenv.config();

process.env.EMAIL_SERVICE = 'Gmail';
process.env.EMAIL_USER = 'sahelksa12@gmail.com';
process.env.EMAIL_PASS = 'zclb dqbj eryz ylqu';
process.env.RESET_PASSWORD_URL = 'http://localhost:3000/reset-password';

const transporter = nodemailer.createTransport({
    serivce: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const register = async (req,res) => {
    try{
        const {firstname, lastname, username, email, password, role} = req.body;
        const user = new User({firstname, lastname, username, email, password, role});
        await user.save();
        res.status(201).json({message: 'user registered successfully'});
    } catch (e) {
        res.status(500).json({ error: e.message});
    }
};

const login = async (req,res) => {
    try{
        const {username,password} = req.body;
        const user = await User.findOne({username});
        if (!user){
            return res.status(400).json({message: 'Invalid Username or Password'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(400).json({message: 'Invalid Username or Password'});
        }
        const token = jwt.sign({id: user._id}, 'secret', {expiresIn: '1h'});
        res.status(200).json({token});
    } catch (e) {
        res.status(500).json({ error: e.message});
    }
};

const forgetPassword = async (req,res) => {
    try{
        const {email} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({message: 'user with this email dose not exist'});
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 360000;
        await user.save();

        const resetUrl = `${process.env.RESET_PASSWORD_URL}/${resetToken}`;

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'password reset',
            text: `you are receving this email because you has requested to reset your password  for your account. \n
            please click on the followimg URL or just paste into your browser to complate the process: \n
            ${resetUrl} \n\n
            if you did not requesest this, just ignore this email. `
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                return res.status(500).json({message: 'error sending this email', error});

            }
            res.status(200).json({message: 'email send'});
        });
    } catch (e) {
        res.status(500).json({error: e.message});
    }
};

const resetPassword = async (req,res) => {
    try{
        const {resetToken} = req.params;
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: {$gt: Date.now()} 
        });
        if (!user) {
            return res.status(400).json({message: 'token is invalid or expired'});
        }
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({message: 'password has been reseted'});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
};


module.exports = {
    register,
    login,
    forgetPassword,
    resetPassword,
}