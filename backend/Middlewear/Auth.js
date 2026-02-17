import jwt from "jsonwebtoken";

export const Autherize = (req, res, next) => {
  const Auth = req.headers["authorization"];
  if (!Auth) {
    return res.status(403).json({ message: "UNAUTHORIZED TOKEN ..." });
  }

  try {
    const decode = jwt.verify(Auth, process.env.JWT_SEC);
    req.user = decode;
    next();
  } catch (error) {
    res.status(500).json({ message: "JWT TOKEN IS WRONG OR EXPIRED..." });
  }
};
