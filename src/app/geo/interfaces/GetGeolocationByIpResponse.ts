import { GetGeolocationByIpProps } from 'src/commons/interfaces/GetGeolocationByIpProps';
import { GetGeolocationByIpResponse as GetGeolocationByIpCommonResponse } from 'src/commons/interfaces/GetGeolocationByIpResponse';

export interface GetGeolocationByIpResponse extends GetGeolocationByIpProps {
  hasError: boolean;
  clientIpCacheKey: string;
  errorMessage?: string;
  geolocation?: GetGeolocationByIpCommonResponse;
}
