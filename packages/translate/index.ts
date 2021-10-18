import aws from "aws-sdk";
import envConfig from "./config/env.config";

aws.config.update({
  accessKeyId: envConfig.AWS.ACCESSKEY,
  secretAccessKey: envConfig.AWS.SECRETKEY,
  region: envConfig.AWS.region,
});

const trans = new aws.Translate();

const translate = {
  translateText: async (target, text) => {
    try {
      if (target == "zhchs") {
        target = "zh";
      } else if (target == "zhcht") {
        target = "zh-TW";
      } else if (target == "arxa") {
        target = "ar";
      }
      return new Promise((resolve, reject) => {
        trans.translateText(
          {
            SourceLanguageCode: "auto",
            TargetLanguageCode: target,
            Text: text,
          },
          (err, data) => {
            if (err) {
              return reject(err);
            } else {
              return resolve(data);
            }
          },
        );
      });
    } catch (e) {
      throw e;
    }
  },
};

export default translate;
