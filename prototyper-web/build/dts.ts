import fs from 'fs/promises';
import path from 'path';

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
        paths: {
          '@prototyper/*-src': ['editor/packages/*'],
        },
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

    const tasks = src.map(async (sourceFile) => {
      const emitOutput = sourceFile.getEmitOutput();
      const emitFiles = emitOutput.getOutputFiles();
      const writeFileTasks = emitFiles.map(async (outputFile) => {
        const filepath = outputFile.getFilePath();
        await fs.mkdir(path.dirname(filepath), {
          recursive: true,
        });
        await fs.writeFile(filepath, outputFile.getText(), 'utf-8');
      });
      return Promise.all(writeFileTasks);
    });
    await Promise.all(tasks);
  });
};
