import { NextFunction, Request, Response } from "express";
import misc from "../func/misc";
import result from "../func/result";
import userService from "../service/user.service";
import translate from "@packages/translate";
import envConfig from "../config/env.config";

interface uploadFile {
  location: string;
}
class IndexController {
  /**
   * 여러 이미지 업로드
   * @param req
   * @param res
   * @param next
   */
  public async uploadImages(req: Request, res: Response, next: NextFunction) {
    try {
      const files = (req.files as any) as uploadFile[];
      if (files) {
        const array = [];
        for (let item of files) {
          array.push(misc.uploadS3Url(item.location));
        }
        next(result.ok({ images: array }));
      } else {
        throw result.badRequest();
      }
    } catch (e) {
      next(e);
    }
  }

  /**
   * 한개 이미지 업로드
   * @param req
   * @param res
   * @param next
   */
  public async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      const file = (req.file as any) as uploadFile;
      if (file) {
        next(result.ok({ image: misc.uploadS3Url(file.location) }));
      } else {
        throw result.badRequest();
      }
    } catch (e) {
      next(e);
    }
  }

  /**
   * 테스트 controller
   * @param req
   * @param res
   * @param next
   */
  public async index(req: Request, res: Response, next: NextFunction) {
    try {
      next(result.ok({ server: envConfig.TYPE }));
    } catch (e) {
      next(e);
    }
  }

  /**
   * 그룹 리스트
   * @param req
   * @param res
   * @param next
   */
  public async getGroups(req: Request, res: Response, next: NextFunction) {
    try {
      const { groups } = await userService.getGroups();
      next(result.ok({ groups }));
    } catch (e) {
      next(e);
    }
  }

  /**
   * 번역 데이터
   * @param req
   * @param res
   * @param next
   */
  public async getTranslate(req: Request, res: Response, next: NextFunction) {
    try {
      // 번역할 언어
      const target = misc.param(req.body, "target");
      // 텍스트
      const text = misc.param(req.body, "text");
      const res = await translate.translateText(target, text);
      next(result.ok(res as any));
    } catch (e) {
      next(e);
    }
  }
}

export default new IndexController();
