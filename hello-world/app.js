const { putItem } = require('/opt/DynamoDBDocClient/docClient')
exports.lambdaHandler = async (event) => {

  const playerDecksItem = {
    Player: event.request.userAttributes.email,
    Decks: '{ "decks": [ { "name": "New User Deck", "cards": [ { "title": "Ori", "count": 3 }, { "title": "Sirius", "count": 3 }, { "title": "Tau", "count": 3 }, { "title": "Arc", "count": 3 }, { "title": "Lac", "count": 3 }, { "title": "Andromeda", "count": 1 }, { "title": "Ross", "count": 1 }, { "title": "Bao", "count": 1 }, { "title": "Capricorn", "count": 1 }, { "title": "Centauri", "count": 1 }, { "title": "cd-9181", "count": 1 }, { "title": "Epsilon", "count": 1 }, { "title": "Fisher", "count": 1 }, { "title": "Foal", "count": 1 }, { "title": "Gliese", "count": 1 }, { "title": "Kapteyn", "count": 1 }, { "title": "Asellus", "count": 1 }, { "title": "Chang", "count": 1 },{ "title": "Auriga", "count": 1 }, { "title": "Naomi", "count": 1 } ] } ] }'
  };

  const playerCardsItem = {
    Player: event.request.userAttributes.email,
    CardInventory: '{ "playerCards": [ { "title": "Tau", "count": 3 }, { "title": "Lac", "count": 3 }, { "title": "Sirius", "count": 3 }, { "title": "Ori", "count": 3 }, { "title": "Arc", "count": 3 }, { "title": "Andromeda", "count": 1 }, { "title": "Asellus", "count": 1 }, { "title": "Ross", "count": 1 }, { "title": "Auriga", "count": 1 }, { "title": "Bao", "count": 1 }, { "title": "Capricorn", "count": 1 }, { "title": "Centauri", "count": 1 }, { "title": "cd-9181", "count": 1 }, { "title": "Chang", "count": 1 }, { "title": "Epsilon", "count": 1 }, { "title": "Fisher", "count": 1 }, { "title": "Foal", "count": 1 }, { "title": "Gliese", "count": 1 }, { "title": "Kapteyn", "count": 1 }, { "title": "Naomi", "count": 1 } ] }'
  };

  const playerSkillItem = {
    Player: event.request.userAttributes.email,
    Skill: 500,
    RecentVictories: [],
    Stardust: 0,
    ShowStoryScene: true,
    MaxTutorialLevelComplete: 0
  };

  const playerStarbuckItem = {
    Player: event.request.userAttributes.email,
    Starbuck: 0
  };

  const playerDeckActiveItem = {
    Player: event.request.userAttributes.email,
    ActiveDeck: 'New User Deck'
  };




  try {
    await putItem('PlayerDecks', playerDecksItem);
    await putItem('PlayerCards', playerCardsItem);
    await putItem('PlayerSkill', playerSkillItem);
    await putItem('PlayerStarbuck', playerStarbuckItem);
    await putItem('PlayerDeckActive', playerDeckActiveItem);
    return event
  } catch (err) {
    return { error: err };
  }
};



