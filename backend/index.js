const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const base64Img = require("base64-img");
const cors = require("cors");

const app = express();
const PORT = 3000;


app.use(cors())
app.use(bodyParser.json());


const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const processFile = (base64String) => {
  try {
    const filePath = base64Img.imgSync(base64String, "uploads", "file");
    const stats = require("fs").statSync(filePath);
    const mimeType = filePath.split(".").pop();
    return {
      file_valid: true,
      file_mime_type: mimeType,
      file_size_kb: (stats.size / 1024).toFixed(2),
    };
  } catch {
    return { file_valid: false };
  }
};


app.post("/bfhl", (req, res) => {
  const { data, file_b64 } = req.body;

  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ is_success: false, message: "Invalid input" });
  }

  const numbers = [];
  const alphabets = [];
  let highestLowerCase = null;
  let hasPrime = false;

  data.forEach((item) => {
    if (!isNaN(item)) {
      numbers.push(item);
      if (isPrime(Number(item))) hasPrime = true;
    } else if (typeof item === "string") {
      alphabets.push(item);
      if (item === item.toLowerCase() && (!highestLowerCase || item > highestLowerCase)) {
        highestLowerCase = item;
      }
    }
  });

  const fileResult = file_b64 ? processFile(file_b64) : { file_valid: false };

  res.json({
    is_success: true,
    user_id: "john_doe_17091999",
    email: "john@xyz.com",
    roll_number: "ABCD123",
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowerCase ? [highestLowerCase] : [],
    is_prime_found: hasPrime,
    ...fileResult,
  });
});

app.get("/bfhl", (req, res) => {
  res.json({ operation_code: 1 });
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));