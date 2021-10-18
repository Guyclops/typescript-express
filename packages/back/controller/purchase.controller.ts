import iap from "@packages/iap";
import webhook from "@packages/webhook";
import { NextFunction, Request, Response } from "express";
import envConfig from "../config/env.config";
import misc from "../func/misc";
import result from "../func/result";
import purchaseService from "../service/purchase.service";
import atob from "atob";
import { PubSub } from "@google-cloud/pubsub";
import logger from "../func/logger";

class PurchaseController {
  /**
   * 구글 인앱결제 검증
   * @param req
   * @param res
   * @param next
   */
  public async checkIapGoogle(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      // 인앱상품 식별아이디
      const sku = misc.param(req.body, "sku");
      // 구매토큰
      const purchaseToken = misc.param(req.body, "purchaseToken");
      // 인앱결제 검사
      const iapResult = await purchaseService.iapGoogle({ sku, purchaseToken });
      if (iapResult.code !== 200) {
        throw result.badRequest("결제검증에 실패했습니다.", -2);
      }
      if (iapResult.data.purchaseState !== 0) {
        throw result.badRequest("결제하지않은 주문입니다..", -3);
      }
      // 결제번호
      const payNo = iapResult.data.orderId;
      next(result.ok());
    } catch (e) {
      next(e);
    }
  }

  /**
   * 애플 인앱결제 검증
   * @param req
   * @param res
   * @param next
   */
  public async checkIapApple(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const sku = misc.param(req.body, "sku");
      // 애플 결제 영수증 데이터
      const receiptData = misc.param(req.body, "receiptData");
      // 인앱결제 검사
      const iapResult = await purchaseService.iapApple({ receiptData });
      if (iapResult.code !== 200) {
        throw result.badRequest("결제검증에 실패했습니다.", -2);
      }
      if (iapResult.data.status !== 0) {
        throw result.badRequest("결제하지않은 주문입니다.", iapResult.data.status);
      }

      const orderData = iapResult.data.receipt;
      const payNo = orderData.in_app[0].transaction_id;

      next(result.ok());
    } catch (e) {
      next(e);
    }
  }

  /**
   * 구글 인앱결제 푸시 알림(환불)
   * googleSubscribe 로 변경
   * @param req
   * @param res
   * @param next
   */
  public async googleIapPush(req: Request, res: Response, next: NextFunction) {
    try {
      // {
      //   message: {
      //     attributes: {
      //       key: value
      //     },
      //     data: "encoded data",
      //     data: {
      //       version: "vsersion",
      //       packageName: "packageName",
      //       eventTimeMillis: 12341412,
      //       oneTimeProductNotification: {
      //         version: "version",
      //         notificationType: 1: 일회성제품 구매(ONE_TIME_PRODUCT_PURCHASED), 2: 일회성 제품 구매 취소(ONE_TIME_PRODUCT_CANCELED),
      //         purchaseToken: "구매토큰",
      //         sku: "상품아이디"
      //       }
      //     }
      //     messageId: "messageid"
      //   },
      //   subscription: "subscript project"
      // }
      const message = misc.param(req.body, "message");
      const data = message.data;
      const obj = JSON.parse(atob(data));
      // 1회성 구매상품 알림인지
      if (obj.oneTimeProductionNotification !== undefined) {
        const notification = obj.oneTimeProductionNotification;
        const notificationType = notification.notificationType;
        if (notificationType == 2) {
          // 구매취소시
          // 구매토큰
          const purchaseToken = notification.purchaseToken;
          // 취소시간
          const canceledAt = misc.moment(Number(obj.eventTimeMillis)).utc().format(envConfig.TIME_FORMAT.UTC);
          // slack 알림
          webhook.send({
            title: `[${envConfig.TYPE === "production" ? "PROD" : "DEV"}]Android PROD 인앱결제 환불`,
            message: JSON.stringify(obj),
            type: "success",
            channel: "결제알림",
          });
        } else {
          // 구매취소가 아닐때
          // slack 알림
          webhook.send({
            title: `[${envConfig.TYPE === "production" ? "PROD" : "DEV"}]Android PROD 인앱결제 예외`,
            message: JSON.stringify(obj),
            type: "warning",
            channel: "결제알림",
          });
        }
      } else {
        // 1회성 상품에대한 알림이 아닐때
        // slack 알림
        webhook.send({
          title: `[${envConfig.TYPE === "production" ? "PROD" : "DEV"}]Android PROD 인앱결제 예외`,
          message: JSON.stringify(obj),
          type: "warning",
          channel: "결제알림",
        });
      }
      next(result.ok());
    } catch (e) {
      next(e);
    }
  }

  /**
   * 애플 인앱결제 푸시 알림(환불)
   * @param req
   * @param res
   * @param next
   */
  public async appleIapPush(req: Request, res: Response, next: NextFunction) {
    try {
      //  {
      //     environment: "Sandbox" or "PROD",
      //     notification_type: "CONSUMPTION_REQUEST" or "REFUND",
      //     unified_receipt: {
      //       environment: "Sandbox" or "Production",
      //       latest_receipt: "Base64-encoded app receipt",
      //       latest_receipt_info: [
      //         {
      //           cancellation_date: "2013-08-01 07:00:00 Etc/GMT",
      //           cancellation_date_ms: "1375340400000",
      //           cancellation_date_pst: "2013-08-01 00:00:00 America/Los_Angeles",
      //           cancellation_reason: "환불사유(0: 다른이유(고객실수 등), 1: 고객이 앱내에서 인지한 문제)",
      //           original_transaction_id: "원본 거래 식별아이디",
      //           product_id: "상품식별아이디",
      //           transaction_id: "거래 식별아이디"
      //         }
      //       ],
      //       status: 0
      //     }
      //  }
      const environment = misc.param(req.body, "environment");
      if (environment == "Sandbox") {
        // sandbox 일때
        // slack 알림
        webhook.send({
          title: `[${envConfig.TYPE === "production" ? "PROD" : "DEV"}]Apple Sandbox 인앱결제`,
          message: JSON.stringify(req.body),
          type: "success",
          channel: "결제알림",
        });
      } else if (environment == "PROD") {
        // 실제 일때
        const notification_type = misc.param(req.body, "notification_type");
        const unified_receipt = misc.param(req.body, "unified_receipt");
        if (notification_type == "REFUND") {
          // 환불일때
          const status = unified_receipt.status;
          if (status == 0) {
            // status == 0 이 정상
            const receipt = unified_receipt.latest_receipt_info;
            // 취소시간
            const canceledAt = misc
              .moment(Number(receipt[0].cancellation_date_ms))
              .utc()
              .format(envConfig.TIME_FORMAT.UTC);
            const transactionId = receipt[0].original_transaction_id;
            // slack 알림
            webhook.send({
              title: `[${envConfig.TYPE === "production" ? "PROD" : "DEV"}]Apple PROD 인앱결제 환불`,
              message: JSON.stringify(req.body),
              type: "success",
              channel: "결제알림",
            });
          } else {
            // status != 0
            // slack 알림
            webhook.send({
              title: `[${envConfig.TYPE === "production" ? "PROD" : "DEV"}]Apple PROD 인앱결제 실패`,
              message: JSON.stringify(req.body),
              type: "error",
              channel: "결제알림",
            });
          }
        } else {
          // 환불 아닐때
          // slack 알림
          webhook.send({
            title: `[${envConfig.TYPE === "production" ? "PROD" : "DEV"}]Apple PROD 인앱결제 예외`,
            message: JSON.stringify(req.body),
            type: "warning",
            channel: "결제알림",
          });
        }
      }
      next(result.ok({}));
    } catch (e) {
      next(e);
    }
  }

  /**
   * 구글 인앱결제 푸시 알림(환불) subscribe 방식
   * @param req
   * @param res
   * @param next
   */
  public async googleSubscribe() {
    try {
      const pubsub = new PubSub({
        projectId: "",
        keyFilename: "",
      });
      const subscription = pubsub.subscription("");
      logger.info(`Subscription ${subscription.name} found`);

      subscription.on("message", async (message) => {
        // {
        //   message: {
        //     attributes: {
        //       key: value
        //     },
        //     data: "encoded data",
        //     data: {
        //       version: "vsersion",
        //       packageName: "packageName",
        //       eventTimeMillis: 12341412,
        //       oneTimeProductNotification: {
        //         version: "version",
        //         notificationType: 1: 일회성제품 구매(ONE_TIME_PRODUCT_PURCHASED), 2: 일회성 제품 구매 취소(ONE_TIME_PRODUCT_CANCELED),
        //         purchaseToken: "구매토큰",
        //         sku: "상품아이디"
        //       }
        //     }
        //     messageId: "messageid"
        //   },
        //   subscription: "subscript project"
        // }
        logger.info(`[${envConfig.TYPE}]Received message: ${message.data.toString()}`);
        message.ack();
        const obj = message.data;
        if (obj.oneTimeProductionNotification !== undefined) {
          const notification = obj.oneTimeProductionNotification;
          const notificationType = notification.notificationType;
          if (notificationType == 2) {
            const purchaseToken = notification.purchaseToken;
            const canceledAt = misc.moment(Number(obj.eventTimeMillis)).utc().format(envConfig.TIME_FORMAT.UTC);
            webhook.send({
              title: `[${envConfig.TYPE === "production" ? "PROD" : "DEV"}]Android 인앱결제 환불`,
              message: obj.toString(),
              type: "success",
              channel: "결제알림",
            });
          } else {
            webhook.send({
              title: `[${envConfig.TYPE === "production" ? "PROD" : "DEV"}]Android 인앱결제 예외`,
              message: obj.toString(),
              type: "warning",
              channel: "결제알림",
            });
          }
        } else {
          webhook.send({
            title: `[${envConfig.TYPE === "production" ? "PROD" : "DEV"}]Android 인앱결제 예외`,
            message: obj.toString(),
            type: "warning",
            channel: "결제알림",
          });
        }
      });

      subscription.on("error", (error) => {
        logger.info(`Received error: ${error}`);
        webhook.send({
          title: `[${envConfig.TYPE === "production" ? "PROD" : "DEV"}]Android 인앱결제 알림`,
          message: JSON.stringify(error),
          type: "error",
          channel: "결제알림",
        });
      });
    } catch (e) {
      throw e;
    }
  }
}

export default new PurchaseController();
