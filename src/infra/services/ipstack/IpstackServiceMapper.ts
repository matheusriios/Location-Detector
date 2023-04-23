import { injectable } from 'inversify';

import { GetGeolocationByIpResponse } from 'src/commons/interfaces/GetGeolocationByIpResponse';
import { GetGeolocationByIpResponse as GetGeolocationByIpResponseIpstack } from './interfaces/GetGeolocationByIpResponse';

@injectable()
export class IpstackServiceMapper {
  serializeGetGeolocationByIp({
    city,
    latitude,
    longitude,
    region_name: region,
    country_name: country,
  }: GetGeolocationByIpResponseIpstack): GetGeolocationByIpResponse {
    return {
      city,
      region,
      country,
      latitude,
      longitude,
    };
  }
}
