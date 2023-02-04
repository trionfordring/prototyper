export interface BuildOptions {
  workDir: string;
  distDir: string;

  proMode: boolean;

  styledComponent: boolean;
  transformLodash: boolean;
  svg: boolean;
}

export let buildOptions: BuildOptions = {
  workDir: '.',
  distDir: '.',
  proMode: process.env.NODE_ENV === 'production',

  styledComponent: false,
  transformLodash: true,
  svg: true,
};

export function setBuildEnv(options: Partial<BuildOptions>) {
  buildOptions = {
    ...buildOptions,
    ...options,
  };
}
