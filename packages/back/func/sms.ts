import aws from "aws-sdk";
import envConfig from "../config/env.config";

// AWS 설정
aws.config.update({
  accessKeyId: envConfig.AWS.ACCESSKEY,
  secretAccessKey: envConfig.AWS.SECRETKEY,
  region: "ap-northeast-1",
});

const SNS = new aws.SNS({ apiVersion: "2010-03-31" });

// 인증번호 메시지
const message = (data: { code: string }) => {
  return `인증번호는 [${data.code}]입니다.`;
};

// 메시지 발송
const sendSMS = async (data: { message: string; phone: string }) => {
  try {
    const response = await SNS.publish({ Message: data.message, PhoneNumber: data.phone }).promise();
    return true;
  } catch (e) {
    throw e;
  }
};

export default { message, sendSMS };
