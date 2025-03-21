const { getItem, updateItem } = require('/opt/DynamoDBDocClient/docClient')
const { createAuthHandler } = require('/opt/authLayer/authWrapper');

const lambdaHandler = async (event, context) => {
  const { user } = event;
  console.log("@1");
  var stardust;

  try {
    console.log("@2");
    const data = await getItem('PlayerSkill', user.email);
    console.log("@3");
    stardust = data.Stardust
    if (data.Item.MaxTutorialLevelComplete >= event.body.level) {
      return;
    }
  } catch (err) {
    return { error: err };
  }
  console.log("stardust: " + stardust);

  try {
    console.log("@4");
    const data = await updateItem(
      'PlayerSkill',
      user.email,
      {
        column: 'MaxTutorialLevelComplete',
        value: event.body.level
      },
      {
        column: 'Stardust',
        value: stardust + 100
      }
    );
    console.log("@5");
    return data;
  } catch (err) {
    return { error: err };
  }

};

exports.lambdaHandler = createAuthHandler(lambdaHandler);
