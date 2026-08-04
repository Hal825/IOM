import { access, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { deleteTaskFiles } from './tasks';

describe('deleteTaskFiles', () => {
  let root: string | undefined;

  afterEach(async () => {
    if (root) await rm(root, { recursive: true, force: true });
  });

  it('删除该任务的 per-job 产物，保留共享 assets 根文件', async () => {
    root = await mkdtemp(path.join(os.tmpdir(), 'om-delete-'));
    const storageDir = path.join(root, 'storage');
    const logDir = path.join(root, 'log', 'procedure');
    const jobId = 'j1';

    // per-job 产物（路径与 lib/agent/nodes.ts 一致）
    await mkdir(path.join(storageDir, 'output'), { recursive: true });
    await writeFile(path.join(storageDir, 'output', `${jobId}.mp4`), 'v');
    await mkdir(path.join(storageDir, 'scenes', jobId), { recursive: true });
    await writeFile(path.join(storageDir, 'scenes', jobId, 's.mp4'), 'v');
    await mkdir(path.join(storageDir, 'scripts', jobId), { recursive: true });
    await mkdir(path.join(storageDir, 'audio', jobId), { recursive: true });
    await mkdir(path.join(storageDir, 'assets', jobId), { recursive: true });
    await mkdir(path.join(logDir, `job-${jobId}`), { recursive: true });

    // 共享资产（根级非 jobId 目录）应保留
    await mkdir(path.join(storageDir, 'assets', 'shared'), { recursive: true });
    await writeFile(path.join(storageDir, 'assets', 'shared', 'lib.png'), 'x');

    await deleteTaskFiles(jobId, { storageDir, logDir });

    // 该任务产物已删除
    await expect(access(path.join(storageDir, 'output', `${jobId}.mp4`))).rejects.toThrow();
    await expect(access(path.join(storageDir, 'scenes', jobId))).rejects.toThrow();
    await expect(access(path.join(storageDir, 'scripts', jobId))).rejects.toThrow();
    await expect(access(path.join(storageDir, 'audio', jobId))).rejects.toThrow();
    await expect(access(path.join(storageDir, 'assets', jobId))).rejects.toThrow();
    await expect(access(path.join(logDir, `job-${jobId}`))).rejects.toThrow();

    // 共享库保留
    await expect(access(path.join(storageDir, 'assets', 'shared', 'lib.png'))).resolves.toBeUndefined();
  });

  it('jobId 不存在时幂等，不抛错', async () => {
    root = await mkdtemp(path.join(os.tmpdir(), 'om-delete-empty-'));
    const storageDir = path.join(root, 'storage');
    await mkdir(storageDir, { recursive: true });
    await expect(deleteTaskFiles('nonexistent', { storageDir })).resolves.toBeUndefined();
  });
});
