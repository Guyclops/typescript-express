// 성공 결과 class
export class SuccessResult {
  statusCode: number;
  code: number;
  message?: string;
  data: object;
  constructor(data: object, code: number, statusCode: number) {
    this.data = data;
    this.code = code;
    this.statusCode = statusCode;
  }
}
// error 결과 class
export class ErrorResult {
  statusCode: number;
  code: number;
  message?: string;
  data: object;
  constructor(message: string, code: number, statusCode: number) {
    this.data = {};
    this.code = code;
    this.statusCode = statusCode;
    this.message = message;
  }
}

class Result {
  // 결과 코드
  public status = {
    ok: {
      statusCode: 200,
    },
    badRequest: {
      statusCode: 400,
      message: "잘못된 요청입니다.",
    },
    unauthorized: {
      statusCode: 401,
      message: "해당 API의 접근할 권한이 없습니다.",
    },
    forbidden: {
      statusCode: 403,
      message: "해당 API의 접근이 금지되었습니다.",
    },
    notFound: {
      statusCode: 404,
      message: "해당 API가 존재하지 않습니다.",
    },
    internalServerError: {
      statusCode: 500,
      message: "서버 오류가 발생했습니다.",
    },
  };
  constructor() {}

  /**
   * 요청 성공
   * @param data
   * @param code
   */
  public ok(data: object = {}, code = 0) {
    return new SuccessResult(data, code, this.status.ok.statusCode);
  }

  /**
   * 잘못된 요청
   * @param message
   * @param code
   * @returns
   */
  public badRequest(message = this.status.badRequest.message, code = -1) {
    return new ErrorResult(message, code, this.status.badRequest.statusCode);
  }

  /**
   * 권한 없음
   * @param message
   * @param code
   * @returns
   */
  public unauthorized(message = this.status.unauthorized.message, code = -1) {
    return new ErrorResult(message, code, this.status.unauthorized.statusCode);
  }

  /**
   * 접근 금지
   * @param message
   * @param code
   * @returns
   */
  public forbidden(message = this.status.forbidden.message, code = -1) {
    return new ErrorResult(message, code, this.status.forbidden.statusCode);
  }

  /**
   * 찾을수없음
   * @param message
   * @param code
   * @returns
   */
  public notFound(message = this.status.notFound.message, code = -1) {
    return new ErrorResult(message, code, this.status.notFound.statusCode);
  }

  /**
   * 서버 내부 에러
   * @param message
   * @param code
   * @returns
   */
  public internalServerError(message = this.status.notFound.message, code = -1) {
    return new ErrorResult(message, code, this.status.internalServerError.statusCode);
  }
}

export default new Result();
