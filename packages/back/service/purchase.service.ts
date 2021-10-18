import fanddleIap from "@packages/iap";

class PurchaseService {
  /**
   * 구글 인앱결제 검증
   * @param data
   * @returns
   */
  public async iapGoogle(data: { sku: string; purchaseToken: string }) {
    try {
      const result = await fanddleIap.iapGoogle(data.sku, data.purchaseToken);
      return result;
    } catch (e) {
      throw e;
    }
  }

  /**
   * 애플 인앱결제 검증
   * @param data
   * @returns
   */
  public async iapApple(data: { receiptData: string }) {
    try {
      const result = await fanddleIap.iapApple(data.receiptData);
      return result;
    } catch (e) {
      throw e;
    }
  }
}

export default new PurchaseService();
