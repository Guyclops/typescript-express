import { NextFunction, Request, Response } from "express";
import envConfig from "../config/env.config";
import logger from "../func/logger";
import result, { SuccessResult, ErrorResult } from "../func/result";
import webhook from "@packages/webhook";

// error시 요청 데이터 log 출력
const errorParams = (req: Request) => {
  logger.info("### Error API Parameters List ###");
  let result = "";
  if (Object.keys(req.params).length !== 0) {
    result = JSON.stringify(req.params);
    logger.info("params: " + result);
  }
  if (Object.keys(req.body).length !== 0) {
    result = JSON.stringify(req.body);
    logger.info("body: " + result);
  }
  if (Object.keys(req.query).length !== 0) {
    result = JSON.stringify(req.query);
    logger.info("query: " + result);
  }
  return result;
};
class ResultMiddleware {
  constructor() {}

  // 찾을수 없음
  public notFound(req: Request, res: Response, next: NextFunction) {
    next(result.notFound());
  }

  // 모든 응답 처리
  public response(data: any, req: Request, res: Response, next: NextFunction) {
    if (data instanceof SuccessResult) {
      // 성공시
      res.status(data.statusCode).send({
        code: data.code,
        data: data.data,
      });
    } else {
      // error시
      let statusCode: number;
      let code = -1;
      let message: string;
      if (data instanceof ErrorResult) {
        // Custom 에러
        statusCode = data.statusCode;
        code = data.code;
        message = data.message;
      } else {
        // Custom 외에는 서버 내부에러로 처리
        statusCode = result.status.internalServerError.statusCode;
        message = String(data);
      }
      if (statusCode === result.status.internalServerError.statusCode) {
        logger.error("InternalServerError:", data);
        message = result.status.internalServerError.message;
      }
      res.status(statusCode).send({ code, message, data: {} });
      if (envConfig.TYPE !== "local" && statusCode === result.status.internalServerError.statusCode) {
        // 서버 내부에러의 경우 slack 알림
        webhook.send({
          title: `[${envConfig.TYPE === "production" ? "PROD" : "DEV"}]${message}`,
          message: String(data),
          statusCode: `${statusCode}`,
          type: "error",
          method: req.method,
          url: req.originalUrl,
          parameters: errorParams(req),
        });
      }
    }
  }
}

export default new ResultMiddleware();
