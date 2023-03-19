const config = {
  graphql: {
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      playgroundAlways: false,
      depthLimit: 50,
      amountLimit: 200,
      apolloServer: {
        tracing: false,
      },
    },
  },
};

export default config;
