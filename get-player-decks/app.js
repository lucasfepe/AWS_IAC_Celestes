const { getItem } = require('/opt/DynamoDBDocClient/docClient')
const { createAuthHandler } = require('/opt/authLayer/authWrapper');

const lambdaHandler = async (event, context) => {
  const { user } = event;

  try {
    const data = await getItem('PlayerDecks', user.email);

    return data.Decks;
  } catch (err) {
    return { error: err };
  }

};
exports.lambdaHandler = createAuthHandler(lambdaHandler);

