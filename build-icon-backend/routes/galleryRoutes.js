const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();


const upload = require("../middleware/upload");

const gallery = require("../data/galleryData");




// ==========================
// GET ALL IMAGES
// ==========================

router.get("/", (req, res) => {

    res.json(gallery);

});






// ==========================
// UPLOAD IMAGE
// ==========================

router.post(

    "/upload",

    upload.single("image"),

    (req, res) => {


        const newImage = {


            id: Date.now(),


            name: req.file.filename,


            url:
            `http://localhost:5002/uploads/${req.file.filename}`


        };



        gallery.push(newImage);



        res.json({

            message:
            "Image uploaded successfully",

            image:newImage

        });



    }

);







// ==========================
// DELETE IMAGE
// ==========================


router.delete(

"/:id",

(req,res)=>{


    const id = req.params.id;



    const imageIndex = gallery.findIndex(

        img => img.id == id

    );



    if(imageIndex !== -1){



        const image = gallery[imageIndex];



        const filePath = path.join(

            "uploads",

            image.name

        );




        // Delete actual image file

        if(fs.existsSync(filePath)){


            fs.unlinkSync(filePath);


        }




        // Remove from gallery array

        gallery.splice(

            imageIndex,

            1

        );



    }



    res.json({

        message:
        "Image deleted successfully",


        gallery:gallery


    });



});






module.exports = router;