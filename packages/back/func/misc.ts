import config from "../config/env.config";
const { TIMEZONE } = config;
import crypto from "crypto";
import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import moment from "moment";
import "moment-timezone";
import result from "./result";
import * as uuid from "uuid";
import envConfig from "../config/env.config";
import { Request } from "express";
import nodemailer from "nodemailer";
import trans from "google-translate-open-api";
import randomstring from "randomstring";

// AWS 설정
aws.config.update({
  accessKeyId: config.AWS.ACCESSKEY,
  secretAccessKey: config.AWS.SECRETKEY,
  region: config.AWS.region,
});

class Misc {
  public moment = moment;
  // s3 업로드
  private s3: aws.S3;
  constructor() {
    this.moment = moment;
    this.s3 = new aws.S3();
  }

  // 파일 업로드
  public upload(path?: string | undefined) {
    return multer({
      storage: multerS3({
        s3: this.s3,
        bucket: config.AWS.bucket,
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req: Request, file, cb) => {
          if (file !== null) {
            const imagePath = this.param(req.body, "imagePath", "");
            cb(
              null,
              `images/app/${path ? `${path}/` : imagePath !== "" ? `${imagePath}/` : ""}${this.uuidv4()}/${String(
                file.originalname,
              ).replace(/\s/g, "_")}`,
            );
          }
        },
      }),
      // 20mb 제한
      limits: { fileSize: 20 * 1024 * 1024 },
    });
  }

  // 비밀번호 생성
  public makePass(password: string) {
    try {
      const pass = crypto.pbkdf2Sync(password, config.AUTH.salt, config.AUTH.repeat, config.AUTH.length, "sha512");
      // hex코드로 주기때문에 암호화된 길이 * 2 가됨
      // 현재는 암호화길이 64 * 2 => 128자의 암호화된 비밀번호 생성
      return pass.toString("hex");
    } catch (e) {
      throw e;
    }
  }

  // API query, body에 있는 데이터 검사
  // 데이터가 없으면 400 error 발생
  // option 지정시 기본값 설정 가능
  public param(data: object, key: string, option?: any) {
    if (data === null || data === undefined) throw result.badRequest(`파라미터 처리 오류입니다.`);
    if (Array.isArray(key)) {
      const errors = [];
      key.map((item) => {
        if (data[item] === undefined) errors.push(item);
      });
      if (errors.length !== 0)
        throw result.badRequest(
          `파라미터 처리 오류입니다. 해당 파라미터를 추가하여 요청해주세요(${JSON.stringify(errors)}).`,
        );
      else return data;
    } else {
      if (data[key] === undefined) {
        if (option === undefined) {
          throw result.badRequest(`파라미터 처리 오류입니다. 해당 파라미터를 추가하여 요청해주세요(${key}).`);
        } else if (typeof option === "function") {
          const value = option(data[key]);
          if (value === undefined)
            throw result.badRequest(`파라미터 처리 오류입니다. 해당 파라미터를 추가하여 요청해주세요(${key}).`);
          return value;
        } else {
          return option;
        }
      } else {
        if (typeof option === "function") {
          const value = option(data[key]);
          return value !== undefined ? value : data[key];
        }
      }
      return data[key];
    }
  }

  // uuid 생성
  public uuidv4() {
    return uuid.v4();
  }

  // upload s3 url => cloudfront 변경
  public uploadS3Url(str: string) {
    return decodeURIComponent(
      String(str).replace(`https://${envConfig.AWS.bucket}.s3.ap-northeast-2.amazonaws.com`, envConfig.AWS.UPLOAD_URL),
    );
  }

  /**
   * 이메일 보내기
   * @param data
   */
  public async sendEmail(data: { subject: string; contents: string; toEmails: Array<string>; html?: string }) {
    try {
      let transporter = nodemailer.createTransport({
        host: "smtps.xxxxx.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: envConfig.AUTH.RESET_EMAIL, // generated ethereal user
          pass: envConfig.AUTH.RESET_PASSWORD, // generated ethereal password
        },
      });

      let info = await transporter.sendMail({
        from: "sender email", // sender address
        to: data.toEmails.join(","), // list of receivers
        subject: data.subject, // Subject line
        text: data.contents, // plain text body
        html: data.html,
      });
      return {};
    } catch (e) {
      throw e;
    }
  }

  /**
   * 번역
   * @param data
   */
  public async translate(text: string, target: string) {
    try {
      const translation = await trans(text, { to: target, client: "dict-chrome-ex" });
      return translation.data.sentences[0];
    } catch (e) {
      throw e;
    }
  }

  /**
   * 접속 ip
   * @param req
   * @returns
   */
  public getClientIp(req: Request) {
    const ip = req.header("x-forwarded-for") || req.ip.split(":")[3];
    return ip;
  }
  /**
   * 접속 user agent
   * @param req
   * @returns
   */
  public getClientAgent(req: Request) {
    const useragent = req.header("User-Agent") || null;
    return useragent;
  }
}

export default new Misc();
