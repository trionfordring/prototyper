export interface BuildOptions {
  workDir: string;
  distDir: string;

  proMode: boolean;

  styledComponent: boolean;
  transformLodash: boolean;
}

export let buildOptions: BuildOptions = {
  workDir: '.',
  distDir: '.',
  proMode: process.env.NODE_ENV === 'production',

  styledComponent: false,
  transformLodash: true,
};

export function setBuildEnv(options: Partial<BuildOptions>) {
  buildOptions = {
    ...buildOptions,
    ...options,
  };
}
