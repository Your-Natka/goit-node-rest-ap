const validate = schema => data => {
  const { error, value } = schema(data);

  if (!error) return { value };

  return {
    value,
    error: error.details.map(err => err.message),
  };
};

export default validate;
