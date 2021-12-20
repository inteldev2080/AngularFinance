import httpStatus from 'http-status';
import multer from 'multer';
import fileType from 'file-type';
import fs from 'fs';
import moment from 'moment-timezone';
import Response from '../services/response.service';
import appSettings from '../../appSettings';

const storage = multer.diskStorage({
  destination: 'public/images/uploads',
  filename(req, file, cb) {
    cb(null, `${moment().tz(appSettings.timeZone).format(appSettings.momentFormat)}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  // dest: 'images/',
  limits: {
    fileSize: 1024 * 1024 * 4, // 2 MB
    files: 1
  },
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(jpe?g|png|gif|bmp|pdf)$/i)) {
      callback(14, false);
    } else {
      callback(null, true);
    }
  }
}).single('image');


function uploadImage(req, res) {
  req.params.image += new Date().getTime();
  upload(req, res, (err) => {
    if (err) {
      res.status(httpStatus.BAD_REQUEST).json(Response.failure(err));
    } else {
      res.json(Response.success({
        fileName: req.file
      }));
    }
  });
}

function get(req, res) {
  const imagepath = `public/images/uploads/${req.params.image}`;
  const image = fs.readFileSync(imagepath);
  const mime = fileType(image).mime;

  res.writeHead(200, { 'Content-Type': mime });
  res.end(image, 'binary');
}

module.exports = {
  uploadImage,
  get
};

