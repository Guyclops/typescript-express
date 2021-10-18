export {};

// 토큰 데이터 타입
export interface tokenData {
  user?: {
    uid?: string;
  };
  account?: {
    uid?: string;
  };
}

// req.user 데이터 타입
export interface userData {
  userSeq?: number;
  uid?: string;
  notification?: number;
  type?: number;
  status?: number;
  name?: string;
  username?: string;
  birthday?: string;
  language?: string;
}

declare global {
  namespace Express {
    interface Request {
      session?: any;
      tokenData?: tokenData;
      user?: userData;
    }
  }
}
