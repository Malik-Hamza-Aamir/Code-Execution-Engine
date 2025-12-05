export const getRightError = (err: any) => {
  let error = '';
  if ('detail' in err.response.data) {
    error = err.response.data.detail;
  } else if ('error' in err.response.data) {
    error = err.response.data.error;
  } else if ('message' in err.response.data) {
    error = err.response.data.message;
  }

  return error;
};

export const getNameInitials = (name: string): string => {
  const nameArr = name.split(' ');
  const arrLen = nameArr.length;

  if (arrLen === 0) {
    return '';
  }

  if (arrLen === 1) {
    return nameArr[0].substring(0, 1).toUpperCase();
  }

  const initials: string = (
    nameArr[0].substring(0, 1) + nameArr[arrLen - 1].substring(0, 1)
  ).toUpperCase();

  return initials;
};
