import { promises as fs } from 'fs';
import path from 'path';

export const readJson = async <T>(filePath: string): Promise<T> => {
  try {
    await fs.access(filePath);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error) {
    // If file doesn't exist, create directory and return empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await writeJson(filePath, []);
      return [] as T;
    }
    throw error;
  }
};

export const writeJson = async <T>(filePath: string, data: T): Promise<void> => {
  try {
    // Ensure directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing JSON file:', error);
    throw error;
  }
}; 