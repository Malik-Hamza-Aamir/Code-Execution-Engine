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
