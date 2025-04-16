const jwt = require('jsonwebtoken');
const SignupModel = require('../Models/Signup');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      // Get user from token
      req.user = await SignupModel.findById(decoded.userId).select('-password');

      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Not authorized, user not found'
        });
        return;
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

module.exports = protect;