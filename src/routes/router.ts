import { Application } from "express";
import images from "./images";
export default function router(app: Application): void {
  /**
   * Every source are specifed here
   */
  app.use("/", images);
  app.get("/health/check", (_req, res) => res.sendStatus(200));
}
