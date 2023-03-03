import { Application, json } from "express";
import morgan from "morgan";

export function configApp(app: Application) {
  app.use(json());
  app.use(morgan("tiny"));
}
