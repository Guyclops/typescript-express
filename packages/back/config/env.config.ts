import dotenv from "dotenv";
dotenv.config();
type periodType = "month" | "day";
export default {
  // 서버 타입 development: 개발, production: 실서버
  TYPE: process.env.NODE_ENV || "development",
  // 서버 포트
  PORT: process.env.PORT || 3000,
  // 세션(사용안함)
  SESSION_EXPIRES_HOUR: 3600 * 1000, // 1시간
  // api 기본 prefix
  API_PREFIX: "/",
  // 타임존
  TIMEZONE: "Asia/Seoul",
  AUTH: {
    // 비밀번호 암호화시 salt
    salt: process.env.PASS_AUTH_SALT,
    // 반복횟수
    repeat: 10000,
    // 길이
    length: 64,
    // 비밀번호 초기화시 발송자 이메일
    RESET_EMAIL: process.env.PASS_RESET_EMAIL,
    // 비밀번호 초기화시 발송자 이메일 비밀번호
    RESET_PASSWORD: process.env.PASS_RESET_PASSWORD,
  },
  TOKEN: {
    // ACCESS_TOKEN
    AUTH: {
      TITLE: "AUTH",
      // 토큰 생성시 키
      SECRET: process.env.JWT_AUTH_SECRET,
      // 토큰 생성시 옵션
      OPTION: {
        expiresIn: "30d", // (60, “2 days”, “10h”, “7d”)
        issuer: "fanddle", // 토큰 발급자
        subject: "auth", // 토큰 제목
      },
    },
    // REFRESH_TOKEN
    REFRESH: {
      TITLE: "REFRESH",
      SECRET: process.env.JWT_REFRESH_SECRET,
      OPTION: {
        expiresIn: "365d", // (60, “2 days”, “10h”, “7d”)
        issuer: "fanddle", // 토큰 발급자
        subject: "auth", // 토큰 제목
      },
    },
  },
  LOG: {
    // log 포맷
    morgan: ":param:date[iso] :status :method :url :response-time ms :res[content-length] bytes",
  },
  AWS: {
    ACCESSKEY: process.env.AWS_ACCESSKEY,
    SECRETKEY: process.env.AWS_SECRETKEY,
    region: "ap-northeast-2",
    bucket: process.env.AWS_BUCKET,
    // S3 파일 업로드시 연결된 CloudFront URL
    UPLOAD_URL: "https://upload.xxxx.co.kr",
  },
  REDIS: {
    // REDIS 접속 주소
    HOST: process.env.REDIS_HOST,
    // REDIS 접속 비밀번호
    PASSWORD: process.env.REDIS_PASSWORD,
  },
  // DB 시간 조회시 사용하는 포맷(+00:00 = UTC 시간 기준으로 조회)
  TIME_FORMAT: {
    UTC: "YYYY-MM-DDTHH:mm:ss+00:00",
    UTC_DAY: "YYYY-MM-DDT15:00:00+00:00",
    UTC_END_DAY: "YYYY-MM-DDT14:59:59+00:00",
  },
  FIREBASE: {
    API_KEY: process.env.FIREBASE_API_KEY || null,
    // 동적링크 생성시 firebase API URL
    DYNAMICLINK_URL: "https://firebasedynamiclinks.googleapis.com/v1/shortLinks",
    // 동적링크 API URL
    DYNAMICLINK_PREFIX: "https://xxxx.page.link",
  },
  APP: {
    ANDROID: {
      PACKAGENAME: "com.xxx.xxx",
    },
    IOS: {
      BUNDLEID: "com.xxx.xxx",
      APPSTOREID: "xxxxxxxxxxxx",
    },
  },
};
