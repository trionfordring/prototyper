export default {
  routes: [
    {
      method: 'GET',
      path: '/preview/:name',
      handler: 'api::application.application.preview',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/preview/:name/(.*)',
      handler: 'api::application.application.preview',
      config: {
        auth: false,
      },
    },
  ],
};
