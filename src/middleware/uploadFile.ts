import multer from "multer";
import path from "path";

const upload = multer({
    storage: multer.diskStorage({
        filename: (req, file, cb) => {
            const filename = Date.now() + "-" + Math.round(Math.random() * 1e9);
            cb(null, filename + "-" + file.originalname);
        }
    }),
})

export default upload