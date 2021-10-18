import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";
const customformat = format.printf((info) => `${info.message}`);
const path = require.main.path;

// logger 생성
const logger = createLogger({
  level: "info",
  transports: [
    // 5일, 5mb 기준 log파일 rotate
    new transports.DailyRotateFile({
      filename: `${path}/logs/server.log`,
      json: false,
      maxSize: "5m",
      maxFiles: 5,
      format: format.combine(customformat),
    }),
    new transports.Console({
      format: customformat,
      level: "info",
    }),
    new transports.DailyRotateFile({
      filename: `${path}/logs/server.error.log`,
      json: false,
      maxSize: "5m",
      maxFiles: 5,
      format: format.combine(customformat),
      level: "error",
    }),
  ],
});

export default logger;
