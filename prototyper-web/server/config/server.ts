const config = ({ env }) => ({
  // host: env('HOST', '0.0.0.0'),
  host: 'prototyper.api',
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});

export default config;
