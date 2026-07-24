const express = require("express");

const router = express.Router();


const projectStatus = require("../data/projectStatusData");




// GET PROJECT STATUS

router.get("/",(req,res)=>{

    res.json(projectStatus);

});





// UPDATE COMPLETE STATUS

router.put("/",(req,res)=>{


    Object.assign(
        projectStatus,
        req.body
    );


    res.json({

        message:"Project Status Updated",

        data:projectStatus

    });


});






// ADD NEW STAGE

router.post("/stage",(req,res)=>{


    const {name}=req.body;



    if(name){

        projectStatus.stages.push({

            name:name,

            status:"pending"

        });

    }


    res.json(projectStatus);


});






// CHANGE STAGE STATUS

router.put("/stage/:index",(req,res)=>{


    const index=req.params.index;


    const {status}=req.body;



    if(projectStatus.stages[index]){

        projectStatus.stages[index].status=status;

    }



    res.json(projectStatus);


});







// DELETE STAGE

router.delete("/stage/:index",(req,res)=>{


    const index=req.params.index;


    projectStatus.stages.splice(

        index,

        1

    );



    res.json(projectStatus);


});




module.exports = router;