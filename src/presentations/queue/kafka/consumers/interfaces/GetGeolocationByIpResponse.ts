import { ErrorMessages } from 'src/app/geo/enums/ErrorMessages';

export interface GetGeolocationByIpResponseSuccess {
  hasError: boolean;
  geolocation?: any;
  errorMessage?: string;
}

export type GetGeolocationByIpResponseError =
  ErrorMessages.DUPLICATED_LOCALIZATION;
