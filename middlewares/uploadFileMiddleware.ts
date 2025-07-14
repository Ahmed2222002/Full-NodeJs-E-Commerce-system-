import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import sharp from "sharp";

import { ApiError } from "../utils/apiError";
import { Request, Response, NextFunction } from "express";

const multerStorage = multer.memoryStorage();

const multerFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Not an image! Please upload only images."), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

async function uploadImage(req: Request, res: Response, next: NextFunction) {

  const uploadSingle = upload.single("image");

  uploadSingle(req, res, async (err: any) => {
    if (err) {
      return next(err);
    }

    if (!req.file) {
      return next();
    }
    const folderName = req.originalUrl.split("/")[3]

    const fileName = `${folderName}-${uuidv4()}-${Date.now()}.jpeg`;

    // store fileName in req to make controller store it in DB
    req.body.image = fileName;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/${folderName}/${fileName}`);
    next();
  });
}

async function uploadProductImages(req: Request, res: Response, next: NextFunction) {
  const uploadFields = upload.fields([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 3 },
  ]);

  uploadFields(req, res, async (err: any) => {
    if (err) {
      return next(err);
    }

    if (!req.files) {
      return next(new ApiError(400, "No image files uploaded"));
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const folderName = req.originalUrl.split("/")[3];
    const fileNames: { imageCover?: string; images?: string[] } = {};

    // Process imageCover
    if (files["imageCover"]) {
      const fileName = `${folderName}-cover-${uuidv4()}-${Date.now()}.jpeg`;
      await sharp(files["imageCover"][0].buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/${folderName}/${fileName}`);
      fileNames.imageCover = fileName;
    }

    // Process images array
    if (files["images"]) {
      fileNames.images = [];
      for (const file of files["images"]) {
        const fileName = `${folderName}-image-${uuidv4()}-${Date.now()}.jpeg`;
        await sharp(file.buffer)
          .resize(500, 500)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/${folderName}/${fileName}`);
        fileNames.images.push(fileName);
      }
    }

    // Store file names in req.body for the controller
    req.body.imageCover = fileNames.imageCover;
    req.body.images = fileNames.images;
    next();
  });

  
}

export { uploadImage, uploadProductImages };
