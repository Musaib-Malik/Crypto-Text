// Import Modules
const express = require("express");
const crypto = require("crypto");

// Instantiate Express Server
const app = express();

// EJS
app.set("view engine", "ejs");

// Middlewares
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));

// Homepage Route
app.get("/", (req, res) => {
  res.render("index");
});

// Encrypt-Data Page Route
app.get("/encrypt", (req, res) => {
  res.render("encrypt");
});

// Decrypt-Data Page Route
app.get("/decrypt", (req, res) => {
  res.render("decrypt");
});

// Encrypt Data Route
app.get("/encrypt/:plainText", (req, res) => {
  // Encrypt Data
  const encryptionKey = crypto.randomBytes(16).toString("hex");
  const iv = crypto.randomBytes(8).toString("hex");

  let cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, iv);
  let encrypted = cipher.update(req.params.plainText, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Send Back Data
  res.send({
    key: encryptionKey,
    iv,
    encryptedText: encrypted,
  });
});

// Decrypt Data Route
app.get("/decrypt/:encryptedText/:key/:iv", (req, res) => {
  // On Error
  if (
    req.params.iv.length < 16 ||
    req.params.iv.length > 16 ||
    req.params.key.length < 32 ||
    req.params.key.length > 32 ||
    req.params.encryptedText.length < 32 ||
    req.params.encryptedText.length > 32
  ) {
    return res.sendStatus(400);
  }

  // Decipher Data
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    req.params.key,
    req.params.iv,
  );
  let decrypted = decipher.update(req.params.encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  res.send(decrypted);
});

// Start Listening
app.listen(process.env.PORT || 5000, console.log("Server Started!"));
