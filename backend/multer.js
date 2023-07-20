const multer = require ("multer");

const storage = multer.diskStorage({
    destination: function(req, res, cd){
        cb(null, "uploads/");
    }, 
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Maths.random() * 1e9);
        const filename = file.originalname.split(".")[0];
        cb(null,filename + "_" + uniqueSuffix + ".png");
    },
});

exports.upload = multer({storage: storage});


//export syntax is used to enable us use it other files