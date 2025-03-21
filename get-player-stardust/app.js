const { createAuthHandler } = require("/opt/authLayer/authWrapper.js")
const { getItem } = require('/opt/DynamoDBDocClient/docClient')


const lambdaHandler = async (event, context) => {
  const { user } = event;


  try {
    const data = await getItem('PlayerSkill', user.email);

    return data.Stardust;
  } catch (err) {
    return { error: err };
  }

};
exports.lambdaHandler = createAuthHandler(lambdaHandler);

