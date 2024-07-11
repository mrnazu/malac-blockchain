// middleware/validationMiddleware.js

function validateTransaction(req, res, next) {
  const { amount, sender, recipient } = req.body;
  if (
    typeof amount !== "number" ||
    typeof sender !== "string" ||
    typeof recipient !== "string"
  ) {
    return res.status(400).json({ error: "Invalid transaction data" });
  }
  next();
}

module.exports = { validateTransaction };
