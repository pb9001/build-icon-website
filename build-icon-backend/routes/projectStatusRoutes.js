const express = require("express");
const router = express.Router();
const db = require("../config/db");


// GET PROJECT STATUS

router.get("/",(req,res)=>{


db.query(

"SELECT * FROM project_status LIMIT 1",

(err,result)=>{


if(err){

return res.status(500).json(err);

}


const data=result[0];


const stages=[

...data.completed.map(item=>({

name:item,

status:"completed"

})),

{

name:data.current_stage,

status:"current"

},

...data.remaining.map(item=>({

name:item,

status:"pending"

}))

];


res.json({

id:data.id,

stages:stages,

possessionDate:data.possession_date

});


}


);


});





// UPDATE PROJECT STATUS

router.put("/",(req,res)=>{


const stages=req.body.stages;


const current=
stages.find(
stage=>stage.status==="current"
);


const completed=
stages
.filter(
stage=>stage.status==="completed"
)
.map(
stage=>stage.name
);


const remaining=
stages
.filter(
stage=>stage.status==="pending"
)
.map(
stage=>stage.name
);



db.query(

`UPDATE project_status
SET current_stage=?,
completed=?,
remaining=?,
possession_date=?
WHERE id=1`,

[

current ? current.name : "",

JSON.stringify(completed),

JSON.stringify(remaining),

req.body.possessionDate

],


(err)=>{


if(err){

return res.status(500).json(err);

}


res.json({

message:"Project Status Updated"

});


}


);


});



module.exports=router;