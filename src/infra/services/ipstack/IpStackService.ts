import { inject, injectable } from 'inversify';

import { HttpAdapter } from 'src/infra/adapters/HttpAdapter';
import { IpstackServiceMapper } from './IpstackServiceMapper';
import { GetGeolocationByIpResponse } from 'src/commons/interfaces/GetGeolocationByIpResponse';

@injectable()
export class IpStackService {
  private readonly apiBaseUrl = process.env.IP_STACK_API_URL;
  private readonly apiAccessKey = process.env.IP_STACK_API_ACCESS_KEY;

  constructor(
    @inject(HttpAdapter)
    private readonly httpAdapter: HttpAdapter,
    @inject(IpstackServiceMapper)
    private readonly ipstackServiceMapper: IpstackServiceMapper,
  ) {}

  public async getGeolocationByIp(
    ipAddress: string,
  ): Promise<GetGeolocationByIpResponse> {
    const url = `${this.apiBaseUrl}/${ipAddress}?access_key=${this.apiAccessKey}`;
    const { data } = await this.httpAdapter.get(url);

    return this.ipstackServiceMapper.serializeGetGeolocationByIp(data);
  }
}
