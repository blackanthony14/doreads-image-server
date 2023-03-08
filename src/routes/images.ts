import { Router } from "express";
import imagesController from "../controllers/images.controller";
import multer from "multer";
const upload = multer();

export default Router()
  .get(`/:id`, (req, res) => imagesController.getImage(req, res))
  .post("/upload", upload.single("image"), (req, res) =>
    imagesController.uploadImage(req, res)
  );