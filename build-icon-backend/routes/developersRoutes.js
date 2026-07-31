const express = require("express");
const router = express.Router();
const db = require("../config/db");
const upload = require("../middleware/upload");

// ==============================
// GET ALL DEVELOPERS
// ==============================

router.get("/", (req, res) => {

db.query(

"SELECT * FROM developers",

(err, results) => {

if(err){

return res.status(500).json(err);

}

const developers = results.map((developer) => ({

...developer,

people:
typeof developer.people === "string"
? JSON.parse(developer.people)
: developer.people,

phones:
typeof developer.phones === "string"
? JSON.parse(developer.phones)
: developer.phones

}));

res.json(developers);

}

);

});

// ==============================
// UPDATE DEVELOPER
// ==============================

router.put("/:id",(req,res)=>{

const {company,logo,people,phones,whatsapp}=req.body;

db.query(

`UPDATE developers
SET company=?,
logo=?,
people=?,
phones=?,
whatsapp=?
WHERE id=?`,

[
company,
logo,
JSON.stringify(people),
JSON.stringify(phones),
whatsapp,
req.params.id
],

(err)=>{

if(err){

return res.status(500).json(err);

}

res.json({

message:"Developer updated successfully"

});

}

);

});

// ==============================
// UPLOAD DEVELOPER LOGO
// ==============================

router.post(

"/upload-logo",

upload.single("logo"),

(req,res)=>{

if(!req.file){

return res.status(400).json({

message:"No image uploaded"

});

}

res.json({

logo:`/uploads/${req.file.filename}`

});

}
);

module.exports=router;