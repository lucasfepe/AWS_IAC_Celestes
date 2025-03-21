const { getItem } = require('/opt/DynamoDBDocClient/docClient')
const { createAuthHandler } = require('/opt/authLayer/authWrapper');


const lambdaHandler = async (event, context) => {
  const { user } = event;

  try {
    const data = await getItem('PlayerSkill', user.email);

    return data.MaxTutorialLevelComplete;
  } catch (err) {
    return { error: err };
  }

};

exports.lambdaHandler = createAuthHandler(lambdaHandler);


