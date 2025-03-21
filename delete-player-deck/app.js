const { getItem, updateItem } = require('/opt/DynamoDBDocClient/docClient')
const { createAuthHandler } = require('/opt/authLayer/authWrapper');

const lambdaHandler = async (event, context) => {
  const { user } = event;
  const angelCards = [
    "Anni",
    "Dante",
    "Gabriella",
    "Hugo",
    "Hunter",
    "Joshua Ramiel",
    "Karthik",
    "Keerthana",
    "Lucius",
    "Lynette",
    "Nick",
    "Pamela",
    "Paul",
    "Poirier",
    "Riddhi",
    "Shemar",
    "Srishti",
    "Tyler",
    "Vlad",
    "Whitney",
    "Xiao",
    "Xing"
  ]
  //get player cards
  var playerCards;

  try {
    const data = await getItem('PlayerCards', user.email);

    playerCards = data.CardInventory;
  } catch (err) {
    return { error: err };
  }



  const playerCardsObjArray = JSON.parse(playerCards).playerCards;

  //check to see if each card title in each deck in event.body.decks exists in the array playerCardsObjArray
  //and that each card count in event.doby.decks[i].cards[i].count is less than or equal to the 
  //count of the card of the same name in playerCardsObjArray
  console.log("event.body: " + JSON.stringify(event))
  var cheat = false;
  event.body.decks.forEach(deck => {

    //first go through the deck and if there is more than one card entry with the same title then reject the deck
    const deckRed = deck.cards.reduce((acc, cur) => {

      if (cur.title in acc) {
        //card already exists in object something funny happening
        console.log("suspicious behaviour from account: \"" + user.email + "\" trying to create deck with more than one card with same title.");
        cheat = true;
      }
      if (cur.count > 3) {
        console.log("suspicious behaviour from account: \"" + user.email + "\" trying to create deck with a card more than 3.");
        cheat = true;
      }
      if (angelCards.includes(cur.title)) {
        if (cur.count > 1) {
          console.log("suspicious behaviour from account: \"" + user.email + "\" trying to create deck with an angel card more than 1.");
          cheat = true;
        }
      }
      acc[cur.title] = cur.count;
      return acc;
    }, {})
    console.log("deckRed: " + JSON.stringify(deckRed));
    deck.cards.forEach(card => {
      if (!playerCardsObjArray.some(x => x.title == card.title
        && x.count >= card.count)) {
        //you don't have the card or the card quantity to make this deck...hacker?
        console.log("suspicious behaviour from account: \"" + user.email + "\" trying to create deck with card you don't have.");
        cheat = true
      }
    })
  })
  if (cheat) {
    return;
  }

  try {
    const res = await updateItem('PlayerDecks', user.email,
      {
        column: 'Decks',
        value: event.body
      });

    return res;
  } catch (err) {
    return { error: err };
  }

};

exports.lambdaHandler = createAuthHandler(lambdaHandler);