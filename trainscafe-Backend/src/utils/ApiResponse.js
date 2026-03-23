export const sendSuccess = (
  res,
  message,
  data = null,
  meta = null,
  status = 200,
) => {
  res.status(status).json({
    success: true,
    message,
    data,
    meta,
  });
};

export const sendError = (res, message, status = 500, details = null) => {
  res.status(status).json({
    success: false,
    message,
    error: {
      statusCode: status,
      details,
    },
  });
};
