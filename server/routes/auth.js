const getToken = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
router.post('/register', async(req, res) => {
	try{
		const {name, email, password} = req.body;
		const existingUser = await User.findOne({email});
		if(existingUser){
			return res.status(400).json({message: 'User already exists'});
		}
		const hashedPassword = await bcryptjs.hash(password, 10);
		const user = new User({name, email, password: hashedPassword});
		await user.save();
		res.status(201).json({message: 'User registered successfully'});
	}catch(error){
		res.status(500).json({message: error.message});
	}
});
router.post('/login', async(req, res) => {
	try{
		const {email, password} = req.body;
		const user = await User.findOne({email});
		if(!user){
			return res.status(400).json({message: 'User not found'});
		}
		const isMatch = await bcryptjs.compare(password, user.password);
		if(!isMatch){
			return res.status(400).json({message: "Invalid credentials"});
		}
		const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
		res.status(200).json({token});
	}catch(error){
		res.status(500).json({message: error.message});
	}
});
router.get('/me', getToken, (req, res) => {
	res.json({message: 'Protected route works!', userId: req.user.userId});
});
module.exports = router;
