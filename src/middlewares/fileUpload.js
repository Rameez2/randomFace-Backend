const multer = require('multer');
const path = require('path');
const fs = require("fs");
const { checkUserStatus } = require("../utils/userUtils")

// Set storage location and filename for uploaded files
const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        console.log('user',req.user);
        
        let uploadPath;
        // const uploadPath = path.join(__dirname, '../public/uploads'); // Resolve path relative to server root

        // // Determine upload path based on the field name
        if (file.fieldname === 'profileImage' && req.path === "/profile") {
            uploadPath = path.join(__dirname, '../public/uploads'); // Save profile images in public/uploads
        } else if (file.fieldname === 'IdentityCardImage' && req.path === "/verify-request") {
            // checkUserStatus(req.user._id).then((status) => {
            //     console.log('staus is',status);
            // })
            let status = await checkUserStatus(req.user._id);
            if(status !== 'pending' && status !== 'verified') {
                console.log('uploaddddddd');
                uploadPath = path.join(__dirname, '../public/idImages'); // Save identity card images in public/idImages
            }
            else {
                console.log('dont upload');
                return cb(new Error('Upload not allowed for users with pending or verified status'), null);
            }

            // if(!req.user.verificationStatus !== 'pending' && req.user.verificationStatus !== 'verified') {
            //     uploadPath = path.join(__dirname, '../public/idImages'); // Save identity card images in public/idImages
            // }
            // else {
            //     return cb(new Error('Upload not allowed for users with pending or verified status'), null);
            // }
        } else {
            // If fieldname doesn't match any expected values, use a default path or handle the error
            return cb(new Error('Invalid field name'), null);
        }

        // Ensure the directory exists (create if not)
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath); // Save files in public/uploads
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext); // Append timestamp to avoid conflicts
    }
});

// Filter to accept only certain file types
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
        return cb(null, true);
    } else {
         // Pass an Error object to cb to handle the rejection
         cb(new Error('Error: Images Only!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: fileFilter
});



module.exports = upload;