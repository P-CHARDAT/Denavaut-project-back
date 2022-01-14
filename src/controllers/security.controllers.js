require("dotenv").config();
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const { ACCESS_TOKEN_SECRET, JWT_EXPIRY_SECONDS } = process.env;

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};
// Fonction pour encrypter le mdp de l'admin
const hashPassword = (password) => {
  return argon2.hash(password, hashingOptions);
};
const verifyPassword = (hashedPassword, password) => {
  return argon2.verify(hashedPassword, password, hashingOptions);
};

function generateAccessToken(data) {
  console.log(JWT_EXPIRY_SECONDS, "expire");
  console.log(ACCESS_TOKEN_SECRET, "token secret");
  return jwt.sign(data, ACCESS_TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: JWT_EXPIRY_SECONDS + "s",
  });
}

const createToken = (req, res) => {
  const admin = { ...req.admin, role: "admin" };
  const token = generateAccessToken({
    mail: admin.mail,
    role: admin.role,
  });
  console.log(token, "token createToken");
  res.cookie("token", token, {
    maxAge: JWT_EXPIRY_SECONDS * 1000,
    httpOnly: true,
  });
  res.json({ token, admin: { role: admin.role } });
};

const authTokenFromCookie = (req, res, next) => {
  let token = req.cookies.token;
  if (!token) {
    return res.status(401).send("Cookie not set or expired");
  }
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    console.log(decoded, "decoded");
    return next();
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      console.log(e);
      return res.status(401).send("JWT 1 is unauthorized");
    }
    return res.status(400).send("Bad request");
  }
};

const refreshToken = (req, res) => {
  let token = req.cookies.token;
  if (!token) {
    return res.status(401).send("Cookie not set or expired");
  }
  let payload;
  try {
    payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return res.status(401).send("JWT 2 is unauthorized");
    }
    return res.status(400).send("Bad request");
  }
  const nowUnixSeconds = Math.round(Number(new Date()) / 1000);
  if (payload.exp - nowUnixSeconds > 120) {
    return res.json({ token, admin: { role: payload.role } });
  }
  const newToken = jwt.sign(
    { mail: payload.mail, role: payload.role },
    ACCESS_TOKEN_SECRET,
    {
      algorithm: "HS256",
      expiresIn: JWT_EXPIRY_SECONDS,
    }
  );
  res.cookie("token", newToken, { maxAge: JWT_EXPIRY_SECONDS * 1000 });
  return res.json({ newToken, admin: { role: payload.role } });
};

module.exports = {
  createToken,
  authTokenFromCookie,
  refreshToken,
  hashPassword,
  verifyPassword,
};
