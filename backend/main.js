const express = require("express");
const cors = require("cors");
const app = express();
const absenceData = require('./api/json_files/absences.json');
const memeberData = require('./api/json_files/members.json');


app.use(cors());
app.use(express.json());

app.get("/employee_detail", (req, res) => {
  res.json({ absenceData: absenceData, memeberData: memeberData });
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});