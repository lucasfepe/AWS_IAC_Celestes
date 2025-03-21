const { getItem } = require('/opt/DynamoDBDocClient/docClient')
const { createAuthHandler } = require('/opt/authLayer/authWrapper');

const lambdaHandler = async (event, context) => {
  const { user } = event;

  try {
    const data = await getItem('PlayerCards', user.email);;

    return data.CardInventory;
  } catch (err) {
    return { error: err };
  }

};
exports.lambdaHandler = createAuthHandler(lambdaHandler);

