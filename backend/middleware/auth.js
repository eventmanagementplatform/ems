const jwt = require('jsonwebtoken');

exports.authOrganizer = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Only check for emsregistrationId
    if (!decoded.emsregistrationId) {
      return res.status(401).json({ message: 'Unauthorized: Missing emsregistrationId' });
    }

    req.user = decoded; // contains emsregistrationId
    console.log("Decoded JWT:", decoded);
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};
