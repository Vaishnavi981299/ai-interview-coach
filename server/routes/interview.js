const express = require('express');
const getToken = require('../middleware/auth');
const Session = require('../models/Session');
const getNextQuestion = require('../services/interviewService');
const router = express.Router();
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
module.exports = router;