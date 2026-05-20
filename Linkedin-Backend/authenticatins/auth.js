    const jwt  = require("jsonwebtoken");
const User=require("../model/User")
exports.auth = async (req, res, next) => {
    try {
        // Support both cookie-based auth AND Authorization: Bearer <token>
        let token = req.cookies.token;
        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
          return  res.status(401).json({ error: "No token, authorization denied" });
        }
        const decode=jwt.verify(token,process.env.JWT_PRIVATE_KEY);
        req.user=await User.findById(decode.userId).select('-password');
        next();
    }
    catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
}