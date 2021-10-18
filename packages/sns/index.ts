import jwksClient from "jwks-rsa";
import api from "./util/api";
import config from "./config/config";
import { decodeToken, verifyToken } from "./util/token";
import moment from "moment";
import "moment-timezone";
moment.tz("Asia/Seoul");

class SNS {
  public async checkKakao(token: string, id: any) {
    try {
      let check = false;
      const response = await api.get(`https://kapi.kakao.com/v1/user/access_token_info`, {
        header: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.id !== undefined && id == response.id) {
        check = true;
      }
      return check;
    } catch (e) {
      return false;
    }
  }

  public async checkNaver(token: string, id: any) {
    try {
      let check = false;
      const response = await api.get(`https://openapi.naver.com/v1/nid/me`, {
        header: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.resultcode == "00") {
        if (response.response.id !== undefined && id == response.response.id) {
          check = true;
        }
      }
      return check;
    } catch (e) {
      return false;
    }
  }

  public async checkFacebook(token: string, id: any) {
    try {
      let check = false;
      const response = await api.get(
        `https://graph.facebook.com/v10.0/me?access_token=${token}&fields=id&format=json&method=get&pretty=0&suppress_http_code=1&transport=cors`,
        {},
      );
      if (response.id !== undefined && id == response.id) {
        check = true;
      }
      return check;
    } catch (e) {
      return false;
    }
  }

  public async checkApple(token: string, id: any) {
    try {
      let check = false;

      /**
       * 애플 토큰 데이터
       * {
       * iss: 'https://appleid.apple.com',
       * aud: '프로젝트',
       * exp: 1616822330,
       * iat: 1616735930,
       * sub: '애플 식별값',
       * c_hash: 'hash값',
       * email: '이메일',
       * email_verified: 'true',
       * auth_time: 1616735930,
       * nonce_supported: true
       * }
       */
      const decode = await decodeToken(token);
      const header = decode.header;

      // publickey 생성
      const client = jwksClient({
        jwksUri: "https://appleid.apple.com/auth/keys",
        cache: true,
      });
      const key = await client.getSigningKey(header.kid);
      const publicKey = key.getPublicKey();
      // nonce 없이 검증
      const verify = verifyToken(token, publicKey) as any;
      // sub 필드 검증
      if (verify.sub !== id) throw Error("sub field error");
      // iss 필드 검증
      if (verify.iss !== config.apple.iss) throw Error("iss field error");
      // aud 필드 검증
      if (verify.aud !== config.apple.aud) throw Error("aud field error");
      // exp 검증
      const now = moment().format("YYYY-MM-DD HH:mm:ss");
      const exp = moment.unix(verify.exp).format("YYYY-MM-DD HH:mm:ss");
      if (exp < now) throw Error("now error");

      check = true;
      return check;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}

export default new SNS();
