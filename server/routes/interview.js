const express = require('express');
const getToken = require('../middleware/auth');
const Session = require('../models/Session');
const getNextQuestion = require('../services/interviewService');
const router = express.Router();
const upload = require('../config/multer');
const pdfParse = require('pdf-parse');
router.post('/start', getToken, async(req, res) => {
    try{
        const {type} = req.body;
        const userId = req.user.userId;
        const firstQuestion = await getNextQuestion([], type, 1);
        const session = new Session({
            userId,
            type,
            difficulty: 1,
            messages: [
                {role: 'ai', content: firstQuestion}
            ]
        });
        await session.save();
        res.status(201).json({session});
    }catch(error){
        res.status(500).json({message: error.message});
    }
});
router.post('/answer', getToken, async(req, res) => {
    try{
        const {sessionId, answer} = req.body;
        const session =  await Session.findById(sessionId);
        if(!session){
            return res.status(404).json({message: "Session not found"});
        }
        session.messages.push({role: 'user', content: answer});
        const nextQuestion = await getNextQuestion(session.messages, session.type,session.difficulty);
        session.messages.push({role: 'ai', content: nextQuestion});
        const difficultyMatch = nextQuestion.match(/DIFFICULTY:\s*(\d)/);
        if(difficultyMatch){
            session.difficulty = parseInt(difficultyMatch[1]);
        }
        await session.save();
        res.status(200).json({session});
    }catch(error){
        res.status(500).json({message: error.message});
    }
})
router.get('/session/:sessionId', getToken, async(req, res) => {
    try{
        const session = await Session.findById(req.params.sessionId);
        if(!session) return res.status(404).json({message: 'Session not found'});
        res.status(200).json({ session });
    }catch(error){
        res.status(500).json({ message: error.message });
    }
})
router.post('/resume', getToken, upload.single('resume'), async(req, res) => {
    try{
        const userId = req.user.userId;
        const pdfData = await pdfParse(req.file.buffer);
        const resumeText = pdfData.text;
        const firstQuestion = await getNextQuestion([], 'Resume', 1, resumeText);
        const session = new Session({
            userId,
            type: 'Resume',
            difficulty: 1,
            messages: [{role: 'ai', content: firstQuestion }]
        });
        await session.save();
        res.status(201).json({ session });
    }} catch(error) {
    console.error('Resume route error:', error);
    res.status(500).json({ message: error.message });
}
})
module.exports = router;
