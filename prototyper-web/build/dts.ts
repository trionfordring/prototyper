import { Project } from 'ts-morph';

import { distPath, srcTsGlob, tsGlobForDir } from './utils/cwd';
import { PROJ_ROOT, TSCONFIG_PATH } from './utils/paths';
import { withTaskName } from './utils/withTaskName';

export const buildDts = (...fileGlobs: string[]) => {
  return withTaskName('generate dts', async () => {
    const project = new Project({
      compilerOptions: {
        allowJs: true,
        noEmitOnError: false,
        declaration: true,
        declarationDir: distPath('types'),
        emitDeclarationOnly: true,
        skipLibCheck: true,
        baseUrl: PROJ_ROOT,
      },
      tsConfigFilePath: TSCONFIG_PATH,
      skipAddingFilesFromTsConfig: true,
    });
    const src = [
      ...project.addSourceFilesAtPaths(srcTsGlob()),
      ...fileGlobs.flatMap((glob) =>
        project.addSourceFilesAtPaths(tsGlobForDir(glob))
      ),
    ];

    console.log(`正在生成dts文件，共计接收${src.length}个源文件`);

    const diagnostics = project.formatDiagnosticsWithColorAndContext(
      project.getPreEmitDiagnostics()
    );
    if (diagnostics) console.log(diagnostics);

    await project.emit({
      emitOnlyDtsFiles: true,
    });
  });
};
