import { Application, json } from "express";
import morgan from "morgan";
import cors from "cors";
const whitelist = process.env.ALLOWED_ORIGINS?.split(",");

const corsOptions: cors.CorsOptions = {
  origin: whitelist || false,
};
export function configApp(app: Application) {
  app.use(cors(corsOptions));
  app.use(json());
  app.use(morgan("tiny"));
}
