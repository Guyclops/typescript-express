import jwt from "jsonwebtoken";
import config from "../config/env.config";
import { tokenData } from "../types/express";
const { TOKEN } = config;

class Token {
  constructor() {}

  // 토큰 생성
  public getToken(data: object, type: "AUTH" | "REFRESH" = "AUTH") {
    try {
      return jwt.sign(data, TOKEN[type].SECRET, TOKEN[type].OPTION);
    } catch (e) {
      throw e;
    }
  }

  // 토큰 검사
  public verifyToken(token: string, type: "AUTH" | "REFRESH" = "AUTH") {
    try {
      return jwt.verify(token, TOKEN[type].SECRET) as tokenData;
    } catch (e) {
      return null;
    }
  }

  // 구글 토큰 decode
  public verifyGoogle(token: string) {
    try {
      return jwt.decode(token);
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}

export default new Token();
