import express from "express";
import morgan from "morgan";
import config from "./config/env.config";
import moment from "moment";
import "moment-timezone";
import cors from "cors";
import logger from "./func/logger";
import indexRoute from "./route/index.route";
import resultMiddleware from "./middleware/result.middleware";
import { database } from "@packages/database";

class App {
  public application: express.Application;

  constructor() {
    this.application = express();
    this.application.use(cors());
    this.application.use(express.json());
    this.application.use(express.urlencoded({ extended: false }));

    morgan.token("date", (req: express.Request, res: express.Response, tz) => {
      return moment.tz(config.TIMEZONE).format("YYYY-MM-DD HH:mm:ss");
    });

    morgan.token("param", (req: express.Request, res: express.Response) => {
      if (Object.keys(req.query).length !== 0) return `query: ${JSON.stringify(req.query)}\n`;
      else if (Object.keys(req.body).length !== 0) return `body: ${JSON.stringify(req.body)}\n`;
      else return `\n`;
    });

    this.application.use(
      morgan(config.LOG.morgan, {
        stream: {
          write: (message: string) => {
            logger.info(message);
          },
        },
      }),
    );

    database.sync({ force: false });

    this.application.set("trust proxy", true);
    this.application.use(config.API_PREFIX, indexRoute.router);
    this.application.use(resultMiddleware.notFound);
    this.application.use(resultMiddleware.response);
  }
}

export default App;
