const jsonwebtoken = require('jsonwebtoken'); // Fixed import syntax
const config = require('../config/appconfig');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
        
    }

    try {
        
        jsonwebtoken.verify(token, config.secret, (err, decoded) => {
            if (err) return res.status(401).send('Invalid Token');
    
            req.user = decoded; 
            next();
        });
    } catch (error) {
        
        return res.status(400).send('Invalid token.');
    }
};

module.exports = authenticate;
