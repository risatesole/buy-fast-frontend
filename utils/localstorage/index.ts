const saveToLocalStorage = (key: string, value: unknown): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getLocalStorageVariable = (key: string) => {
  const value = localStorage.getItem(key);

  if (value === null) {
    return null;
  }

  return JSON.parse(value);
};
