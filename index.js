require("dotenv").config();
const express = require("express");
const app = express();

const { Deta } = require("deta");

const deta = Deta(process.env.KEY);
const db = deta.Base(process.env.DB);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.set("view engine", "ejs");

app.get("/", (req, res) => res.render("index"));
app.get("/subscribe", (req, res) => {
  const { email } = req.query;
  res.render("subscribe", { email });
});
app.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  const status = await db.put({ email });
  console.log(status);
  res.render("thanks");
});

// export 'app'
if (process.env.DETA_RUNTIME) {
  module.exports = app;
} else {
  app.listen(3061, () => console.log("Deta on local"));
}
