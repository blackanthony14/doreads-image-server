import { Application } from "express";
import images from "./images";
export default function router(app: Application): void {
  /**
   * Every source are specifed here
   */
  app.use("/image",images);
}