import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fs, vol } from 'memfs';
import { writeFile } from '@utils/file';

vi.mock('node:fs', async () => {
  const memfs = await vi.importActual<{ fs: typeof fs }>('memfs')
  return memfs.fs
})

vi.mock('node:fs/promises', async () => {
  const memfs: { fs: typeof fs } = await vi.importActual<{ fs: typeof fs }>('memfs')
  return memfs.fs.promises
})

describe('writeFile', () => {
  beforeEach(() => {
    // Reset the virtual file system before each test
    vol.reset();
  });

  it('should create a directory and write a file with serialized data', () => {
    const key = 'testKey';
    const data = { a: 1, b: new Set([2, 3]) };

    writeFile(key, data);

    // Check if the directory was created
    expect(vol.existsSync('data')).toBe(true);

    // Check if the file was written correctly
    const fileContent = vol.readFileSync('data/testKey.json', 'utf8');
    expect(fileContent).toBe(JSON.stringify({ a: 1, b: [2, 3] }));
  });

  it('should overwrite an existing file', () => {
    const key = 'testKey';
    const initialData = { a: 1 };
    const newData = { b: 2 };

    // Write initial data
    writeFile(key, initialData);

    // Overwrite with new data
    writeFile(key, newData);

    // Check if the file was overwritten
    const fileContent = vol.readFileSync('data/testKey.json', 'utf8');
    expect(fileContent).toBe(JSON.stringify(newData));
  });
});
