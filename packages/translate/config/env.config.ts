import dotenv from "dotenv";
dotenv.config();
export default {
  TYPE: process.env.NODE_ENV || "development",
  AWS: {
    ACCESSKEY: process.env.AWS_ACCESSKEY,
    SECRETKEY: process.env.AWS_SECRETKEY,
    region: "ap-northeast-2",
    bucket: process.env.AWS_BUCKET,
    UPLOAD_URL: "https://upload.xxxxx.co.kr",
  },
};
