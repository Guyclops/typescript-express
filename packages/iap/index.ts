import * as google from "googleapis";
import iapConfig from "./config/iap.config";
import api from "@packages/api";

/**
 * 구글 인앱결제 검증
 * @param data
 * @returns
 */
const iapGoogle = async (sku: string, purchaseToken: string) => {
  try {
    const auth = new google.Auth.GoogleAuth({
      keyFile: "./packages/iap/config/android-firebase.json",
      scopes: ["https://www.googleapis.com/auth/androidpublisher"],
    });
    const accessToken = await auth.getAccessToken();
    const result = await api.get(
      `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${iapConfig.APP.ID.ANDROID}/purchases/products/${sku}/tokens/${purchaseToken}?access_token=${accessToken}`,
    );
    return result;
  } catch (e) {
    throw e;
  }
};

/**
 * 애플 인앱결제 검증
 * @param receipt_data
 * @returns
 */
const iapApple = async (receipt_data: string) => {
  try {
    /**
     * {
    "receipt": {
        "receipt_type": "ProductionSandbox",
        "adam_id": 0,
        "app_item_id": 0,
        "bundle_id": "com.belive.app.ios",
        "application_version": "3",
        "download_id": 0,
        "version_external_identifier": 0,
        "receipt_creation_date": "2018-11-13 16:46:31 Etc/GMT",
        "receipt_creation_date_ms": "1542127591000", // 영수증생성일
        "receipt_creation_date_pst": "2018-11-13 08:46:31 America/Los_Angeles",
        "request_date": "2021-05-20 09:22:46 Etc/GMT",
        "request_date_ms": "1621502566556", //검증 요청일
        "request_date_pst": "2021-05-20 02:22:46 America/Los_Angeles",
        "original_purchase_date": "2013-08-01 07:00:00 Etc/GMT",
        "original_purchase_date_ms": "1375340400000",
        "original_purchase_date_pst": "2013-08-01 00:00:00 America/Los_Angeles",
        "original_application_version": "1.0",
        "in_app": [
            {
                "quantity": "1",
                "product_id": "test2", // 상품 sku
                "transaction_id": "1000000472106082", //영수증 ID
                "original_transaction_id": "1000000472106082",
                "purchase_date": "2018-11-13 16:46:31 Etc/GMT",
                "purchase_date_ms": "1542127591000", //결제일시
                "purchase_date_pst": "2018-11-13 08:46:31 America/Los_Angeles",
                "original_purchase_date": "2018-11-13 16:46:31 Etc/GMT",
                "original_purchase_date_ms": "1542127591000",
                "original_purchase_date_pst": "2018-11-13 08:46:31 America/Los_Angeles",
                "is_trial_period": "false"
            }
        ]
    },
    "environment": "Sandbox",
    "status": 0
}
     */
    let result = await api.post(`https://buy.itunes.apple.com/verifyReceipt`, {
      body: { [`receipt-data`]: receipt_data },
    });
    // 개발환경 결제
    if (result.data.status == 21007) {
      result = await api.post(`https://sandbox.itunes.apple.com/verifyReceipt`, {
        body: { [`receipt-data`]: receipt_data },
      });
    }
    return result;
  } catch (e) {
    throw e;
  }
};

export default {
  iapApple,
  iapGoogle,
};
