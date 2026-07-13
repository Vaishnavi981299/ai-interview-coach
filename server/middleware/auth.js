const jwt = require('jsonwebtoken');
function getToken(req, res, next){
try{
	const header = req.headers.authorization;
	if(!header || !header.startsWith('Bearer ')){
		return res.status(401).json({message: "No token, authorization denied"});
	}
	const token = header.split(' ')[1];
	const decoded = jwt.verify(token, process.env.JWT_SECRET);
	req.user = decoded;
	next();
}catch(error){
	return res.status(401).json({message: "Token is not valid"});
}
}
module.exports = getToken;
