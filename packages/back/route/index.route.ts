import { Router } from "express";
import indexController from "../controller/index.controller";
import misc from "../func/misc";
import authMiddleware from "../middleware/auth.middleware";
const { checkTokenAuth } = authMiddleware;

class IndexRouter {
  public router: Router;
  constructor() {
    this.router = Router();
    this.router.get("/", indexController.index);
    this.router.post("/upload/image", checkTokenAuth, misc.upload().single("image"), indexController.uploadImage);
    this.router.post("/upload/images", checkTokenAuth, misc.upload().array("images"), indexController.uploadImages);
    this.router.get("/auth", checkTokenAuth, indexController.index);
    // 그룹 리스트
    this.router.get("/group/list", indexController.getGroups);

    // 번역
    this.router.post("/translate", checkTokenAuth, indexController.getTranslate);
  }
}

export default new IndexRouter();
