import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_FILES = ['.env.local', '.env'];

function parseLine(line: string): [string, string] | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) {
    return null;
  }

  const equalsIndex = trimmed.indexOf('=');
  if (equalsIndex === -1) {
    return null;
  }

  const key = trimmed.slice(0, equalsIndex).trim();
  if (!key) {
    return null;
  }

  let value = trimmed.slice(equalsIndex + 1).trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }

  return [key, value];
}

export function loadEnvFiles(files: string[] = DEFAULT_FILES) {
  const cwd = process.cwd();

  for (const file of files) {
    const filePath = path.resolve(cwd, file);
    if (!fs.existsSync(filePath)) {
      continue;
    }

    const contents = fs.readFileSync(filePath, 'utf8');
    const lines = contents.split(/\r?\n/);

    for (const line of lines) {
      const parsed = parseLine(line);
      if (!parsed) {
        continue;
      }

      const [key, value] = parsed;
      if (typeof process.env[key] === 'undefined') {
        process.env[key] = value;
      }
    }
  }
}
