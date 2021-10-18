import App from "./app";
import config from "./config/env.config";
import purchaseController from "./controller/purchase.controller";

const app = new App().application;
if (config.TYPE == "production") {
  // 구글 iap 알림 구독
  purchaseController.googleSubscribe();
}

app.listen(config.PORT, () => {
  console.log(`SERVER START: ${config.PORT}`);
});
