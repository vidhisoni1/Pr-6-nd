const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        return cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        const filename = `${Date.now()}-${file.originalname}`
        return cb(null, filename)
    }
})
const upload = multer({ storage }).single('image')

module.exports = { upload }
