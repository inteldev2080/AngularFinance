import express from 'express';
// import uploadCtrl from '../controllers/upload.controller';
import httpStatus from 'http-status';
import multer from 'multer';
// import fileupload from 'express-fileupload';
import fileType from 'file-type';
import fs from 'fs';
import Response from '../services/response.service';
import appSettings from '../../appSettings';

const router = express.Router(); // eslint-disable-line new-cap

const upload = multer({
  dest: 'images/',
  limits: {
    fileSize: 1024 * 1024 * 12,  // 2 MB
    files: 1
  },
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(jpe?g|png|gif|bmp|pdf)$/i)) {
      callback(14, false);
    } else {
      callback(null, true);
    }
  }
});

/** POST /api/upload/image - Uploads an image to the server */
router.post('/image', upload.single('image'), (req, res, err) => {
  if (req.file === null) {
    res.status(httpStatus.BAD_REQUEST).json(Response.failure(err));
  } else if (req.file.size > appSettings.maxImageSize) {
    res.status(httpStatus.BAD_REQUEST).json({
      status: 'Failure',
      errorCode: 1,
      data: 'Image is too large....'
    });
  } else {
    res.json(Response.success({
      filename: req.file.filename,
      path: `${appSettings.fileUploadUrl}${req.file.filename}`
    }));
  }
});


/** GET /api/upload/:image - Gets an uploaded image from the server */
router.get('/image/:image', (req, res) => {
  const imagepath = `images/${req.params.image}`;
  const image = fs.readFileSync(imagepath);
  const mime = fileType(image).mime;

  res.writeHead(200, { 'Content-Type': mime });
  res.end(image, 'binary');
});

export default router;
