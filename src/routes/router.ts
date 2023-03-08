import { Application } from "express";
import imagesController from "../controllers/images.controller";
import multer from "multer";
const upload = multer();
export default function router(app: Application): void {
  /**
   * Every source are specifed here
   */
  app.get(`/:id`, (req, res) => imagesController.getImage(req, res))
  app.post("/upload", upload.single("image"), (req, res) =>
    imagesController.uploadImage(req, res))
}
