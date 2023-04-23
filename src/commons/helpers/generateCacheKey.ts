export const generateClientIpCacheKey = (
  ipAddress: string,
  clientId: string,
): string => {
  return `${ipAddress}:${clientId}`;
};
