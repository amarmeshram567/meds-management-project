import multer from "multer";

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },

//     filename: function (req, file, cb) {
//         const uniqueName = `${Date.now()}-${file.originalname}`;
//         cb(null, uniqueName)
//     }
// })

// const upload = multer({
//     storage,
//     limits: { fileSize: 5 * 1024 * 1024}
// })

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024},
})

export default upload;