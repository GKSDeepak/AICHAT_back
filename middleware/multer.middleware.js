const  multer = require( 'multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')               //cb means call back
    },
    filename: function (req, file, cb) {
     // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      //cb(null, file.fieldname + '-' + uniqueSuffix)
      cb(null, file.originalname)

    }
  });
  
export const upload = multer({ storage: storage })