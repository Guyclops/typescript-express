import { NextFunction, Request, Response } from "express";
import logger from "../func/logger";
import result from "../func/result";
import token from "../func/token";
import userService from "../service/user.service";

class AuthMiddleware {
  constructor() {}

  // 세션 로그인 검사 미들웨어(사용안함)
  public async checkSessionAuth(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.session.data === undefined) {
        throw result.unauthorized();
      }
      req.tokenData = req.session.data;
      next();
    } catch (e) {
      next(e);
    }
  }

  // 토큰 검사 미들웨어
  public async checkTokenAuth(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.headers.authorization === undefined) throw result.unauthorized();
      const tokens = req.headers.authorization.split(" ");
      if (tokens.length !== 2 || tokens[0] !== "Bearer") throw result.unauthorized();
      let tokenData = tokens[1];
      const decoded = token.verifyToken(tokenData, "AUTH");
      if (decoded === undefined || decoded === null) throw result.unauthorized();
      req.tokenData = decoded;
      // 토큰데이터 회원 조회
      const user = await userService.getUser({ uid: decoded.user.uid });
      if (user === null) {
        throw result.unauthorized();
      }
      if (user.status != 1) {
        if (user.type != 2 || user.status != 0) {
          throw result.unauthorized();
        }
      }
      req.user = user;
      next();
    } catch (e) {
      next(e);
    }
  }

  // 구글 권한 검사(jwt decode만)
  public async checkGoogleIapAuth(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.headers.authorization === undefined) throw result.unauthorized();
      const tokens = req.headers.authorization.split(" ");
      if (tokens.length !== 2 || tokens[0] !== "Bearer") {
        throw result.unauthorized();
      }
      let tokenData = tokens[1];
      const decoded = token.verifyGoogle(tokenData);
      if (decoded === undefined || decoded === null) {
        throw result.unauthorized();
      }
      logger.log("decode", decoded);
      next();
    } catch (e) {
      next(e);
    }
  }
}

export default new AuthMiddleware();
