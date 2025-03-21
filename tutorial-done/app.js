const { updateItem } = require('/opt/DynamoDBDocClient/docClient')
const { createAuthHandler } = require('/opt/authLayer/authWrapper');

const lambdaHandler = async (event, context) => {
  const { user } = event;

  try {
    const res = await updateItem('PlayerSkill', user.email,
      {
        column: 'ShowStoryScene',
        value: false
      });

    return res;
  } catch (err) {
    return { error: err };
  }

};
exports.lambdaHandler = createAuthHandler(lambdaHandler);

