const { updateItem } = require('/opt/DynamoDBDocClient/docClient')
const { createAuthHandler } = require('/opt/authLayer/authWrapper');

const lambdaHandler = async (event, context) => {
  const { user } = event;

  console.log("activeDeck: " + event.body.activeDeck)

  try {
    const data = await updateItem('PlayerDeckActive', user.email,
      {
        column: 'ActiveDeck',
        value: event.body.activeDeck
      });

    return data.Item.ActiveDeck;
  } catch (err) {
    return { error: err };
  }

};
exports.lambdaHandler = createAuthHandler(lambdaHandler);

