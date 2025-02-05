export interface IApiResponse<T> {
    success: boolean;
    code: number;
    message: string;
    data?: T;
    timestamp: string;
    meta?: Record<string, number | string>;
  }