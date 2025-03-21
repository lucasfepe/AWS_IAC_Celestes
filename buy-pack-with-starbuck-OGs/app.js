const { getItem, scanTable, purchaseTransaction } = require('/opt/DynamoDBDocClient/docClient')
const { createAuthHandler } = require('/opt/authLayer/authWrapper');

const lambdaHandler = async (event, context) => {
  const { user } = event;
  //check if this player has enough Starbuck

  const price = 10;

  var PlayerStarbuck;
  try {
    const data = await getItem('PlayerStarbuck', user.email);

    PlayerStarbuck = data.Starbuck;
  } catch (err) {
    return { error: "not enough Starbuck2!" };
  }

  if (PlayerStarbuck < price) {
    return { error: "not enough Starbuck!" }
  }

  //player does have enough Starbuck then minus the Starbuck price



  //add the cards to player cards

  //select 5 cards from the collections

  try {
    console.log("@1")
    var cardsInPack = [];
    const data = await scanTable(
      'DivineCard',
      '#dynobase_collection = :s ',
      'Title, #dynobase_collection, Rarity',
      { '#dynobase_collection': 'Collection' },
      { ':s': 1 }
    );
    const cards = data.Items;
    //select 3 common cards
    const commonCards = cards.filter(x => x.Rarity == 1);
    const uncommonCards = cards.filter(x => x.Rarity == 2);
    const rareCards = cards.filter(x => x.Rarity == 3);
    const uniqueCards = cards.filter(x => x.Rarity == 4);
    const shuffledCommonCards = commonCards.sort(() => Math.random() - 0.5);
    const shuffledUncommonCards = uncommonCards.sort(() => Math.random() - 0.5);
    const shuffledRareCards = rareCards.sort(() => Math.random() - 0.5);
    const shuffledUniqueCards = uniqueCards.sort(() => Math.random() - 0.5);
    cardsInPack.push(shuffledCommonCards.pop());
    cardsInPack.push(shuffledCommonCards.pop());
    cardsInPack.push(shuffledCommonCards.pop());
    console.log("@2")
    //4th card is 50% common 50% uncommon
    const random1 = Math.random();
    if (random1 < .5) {
      //common
      console.log("common")
      cardsInPack.push(shuffledCommonCards.pop());
    } else {
      console.log("uncommon")
      cardsInPack.push(shuffledUncommonCards.pop());
    }
    //5th card is 50% uncommon, 40% rare, 10% unique
    const random = Math.random();

    if (random > .4) {
      console.log("uncommon")
      cardsInPack.push(shuffledUncommonCards.pop());
    } else if (random > .1) {
      console.log("rare")
      cardsInPack.push(shuffledRareCards.pop());
    } else {
      console.log("unique")
      cardsInPack.push(shuffledUniqueCards.pop());
    }



    //somehow add the cardsInPack to the player's cards


    var playerCardsJson;
    try {

      const data = await getItem('PlayerCards', user.email);


      playerCardsJson = JSON.parse(data.CardInventory);

      cardsInPack.reduce((sum, cur) => {



        if (sum.playerCards.some(x => x.title == cur.Title)) {


          sum.playerCards.find(x => x.title == cur.Title).count++;
        } else {

          sum.playerCards.push({ "title": cur.Title, "count": 1 });
        }

        return sum;
      }, playerCardsJson);

    } catch (err) {
      return err;
    }

    try {

      const res = await purchaseTransaction(user.email, 'PlayerStarbuck', 'Starbuck', PlayerStarbuck - price, JSON.stringify(playerCardsJson));

    } catch (err) {
      return { error: "not enough Starbuck5!" };
    }

    return cardsInPack.map(x => x.Title);
  } catch (err) {
    return { error: "not enough Starbuck6!" };
  }


};

exports.lambdaHandler = createAuthHandler(lambdaHandler);

