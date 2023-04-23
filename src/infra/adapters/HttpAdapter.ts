import { injectable } from 'inversify';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export type HttpAdapterResponse = AxiosResponse;

@injectable()
export class HttpAdapter {
  private axios: AxiosInstance;

  constructor() {
    this.axios = axios.create();
  }

  public async get(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<any>> {
    return this.axios.get(url, config);
  }
}
