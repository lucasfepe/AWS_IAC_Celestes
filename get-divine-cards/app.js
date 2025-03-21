const { scanTable } = require('/opt/DynamoDBDocClient/docClient')
const { createAuthHandler } = require('/opt/authLayer/authWrapper');

const lambdaHandler = async (event, context) => {

  try {
    const data = await scanTable('DivineCard');

    return data;
  } catch (err) {
    return { error: err };
  }

};

exports.lambdaHandler = createAuthHandler(lambdaHandler);