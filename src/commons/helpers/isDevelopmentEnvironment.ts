const environments = ['development', 'test'];
export const isDevelopmentEnvironment = () =>
  environments.includes(process.env.NODE_ENV);
