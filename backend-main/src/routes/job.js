const { Router } = require("express");
const SqlString = require("sqlstring");
const sqlite3 = require("sqlite3");

const db = new sqlite3.Database(
  process.env.NODE_ENV === "production"
    ? "/app/nycjobs.sqlite"
    : "nycjobs.sqlite"
);

const router = Router();

// Job page
router.get("/:id", (req, res) => {
  const id = SqlString.escape(req.params.id);

  db.all(`SELECT * FROM "jobs" WHERE "Job ID" = ${id} LIMIT 1`, (err, rows) => {
    // Send status code 500 if there was an error
    if (err) {
      console.error(err);
      res.status(500).send(`Could not get job info with ID ${id}.`);
    }

    // Otherwise, send the rows in JSON
    res.json(rows[0]);
  });
});

//post onto the database
router.post("/", (req, res)=> {
    const { businessTitle, agency, location, fpTime, hours, postDate,
          jobDesc, miniQual, prefSkill, addInfo, rContact } = req.body
    db.run(`INSERT INTO "jobs" ("Business Title", "Agency", "Work Location", 
      "Full-Time/Part-Time indicator", "Hours/Shift", "Posting Date",
      "Job Description", "Minimum Qual Requirements", 
      "Preferred Skills", "Additional Information", 
      "Recruitment Contact") VALUES (?,?,?,?,?,?,?,?,?,?,?)`, 
      [businessTitle, agency, location, fpTime, hours, postDate,
        jobDesc, miniQual, prefSkill, addInfo, rContact],(err) => {
          if (err) {
            console.error(err);
            res.status(500).send("Cannot add job");
          }
         
           
        res.json({status:"okay"});
        })

    

});
module.exports = router;
