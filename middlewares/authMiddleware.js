import jwt from 'jsonwebtoken';

const JWT_SECRET = 'secretkey123';

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer token"

  if (!token) return res.status(401).send('Token missing');

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = decoded; // decoded token data
    next();
  });
}
