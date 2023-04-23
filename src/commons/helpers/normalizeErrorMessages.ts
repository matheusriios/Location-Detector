import { ErrorMessages } from 'src/app/geo/enums/ErrorMessages';

export const normalizeDuplicatedLocalizationErrorMessage = (
  cacheKey: string,
  minutes = parseInt(process.env.IP_SEARCH_WINDOW_MINUTES),
) => {
  const messageWithCacheKey = ErrorMessages.DUPLICATED_LOCALIZATION.replace(
    'IP:CLIENT_ID',
    cacheKey,
  );

  return minutes > 1
    ? messageWithCacheKey.replace('XXX', minutes.toString())
    : messageWithCacheKey.replace(
        'XXX minutes',
        `${minutes.toString()} minute`,
      );
};
