module.exports = {
  root: true,
  extends: [
    'prettier',
    'plugin:prettier/recommended',
    'react-app',
    'plugin:import/typescript',
  ],
  rules: {
    'no-html-link-for-pages': 0,
  },
  settings: {
    next: {
      rootDir: '.',
    },
  },
};
