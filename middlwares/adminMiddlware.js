const jwt = require('jsonwebtoken');

const adminMiddlware = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(404).json({ message: 'no token provided'});
    }

    const token = authHeader.split('')[1];
    if (!token) {
        return res.status(404).json({ message: 'no token provided'});
    }
    try{
        const decoded = jwt.verify(token, 'secret');
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied, Only Admins'});
        }
        req.user = decoded;
        next();
    } catch (e) {
        res.status(400).json({ message: 'token invalid'});
    }
}

module.exports = adminMiddlware;