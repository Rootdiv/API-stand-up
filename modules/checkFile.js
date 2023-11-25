import { access, writeFile } from 'node:fs/promises';

export const checkFileExist = async path => {
  try {
    await access(path);
  } catch (error) {
    console.log(error);
    console.error(`Файл ${path} не найден!`);
    return false;
  }

  return true;
};

export const createFileIfNotExist = async path => {
  try {
    await access(path);
  } catch (error) {
    console.log(error);
    await writeFile(path, '[]', 'utf-8');
    console.log(`Файл ${path} был создан!`);
    return true;
  }
};
