const { deleteItem } = require('/opt/DynamoDBDocClient/docClient')
const { createAuthHandler } = require('/opt/authLayer/authWrapper');

const lambdaHandler = async (event, context) => {

  const { user } = event;

  try {
    await deleteItem('PlayerDeckActive', user.email);
  } catch (err) {
    return { error: "Error deleting deck!" };
  }

  return "Success";
};

exports.lambdaHandler = createAuthHandler(lambdaHandler);