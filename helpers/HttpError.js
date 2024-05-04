const messageList = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
};

class HttpError extends Error {
  constructor(status, message = messageList[status], data = undefined) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export default HttpError;
