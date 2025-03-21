const { getItem, scanTable, purchaseTransaction } = require('/opt/DynamoDBDocClient/docClient')
const { createAuthHandler } = require('/opt/authLayer/authWrapper');

const lambdaHandler = async (event, context) => {
  const { user } = event;

  //check if this player has enough stardust

  const price = 300;
  var playerStardust;
  try {
    const data = await getItem('PlayerSkill', user.email);

    playerStardust = data.Stardust;
  } catch (err) {
    return { error: "not enough stardust2!" };
  }

  if (playerStardust < price) {
    return { error: "not enough stardust!" }
  }

  //player does have enough stardust then minus the stardust price



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
      { ':s': 2 }
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
    //4th card is 60% common 40% uncommon
    const random1 = Math.random();
    if (random1 < .6) {
      //common
      console.log("common")
      cardsInPack.push(shuffledCommonCards.pop());
    } else {
      console.log("uncommon")
      cardsInPack.push(shuffledUncommonCards.pop());
    }
    //5th card is 76% uncommon, 20% rare, 4% unique
    const random = Math.random();

    if (random > .24) {
      console.log("uncommon")
      cardsInPack.push(shuffledUncommonCards.pop());
    } else if (random > .04) {
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


      const res = await purchaseTransaction(user.email, 'PlayerSkill', 'Stardust', playerStardust - price, JSON.stringify(playerCardsJson));

    } catch (err) {
      return { error: "not enough stardust5!" };
    }

    return cardsInPack.map(x => x.Title);
  } catch (err) {
    return { error: "not enough stardust6!" };
  }


};
exports.lambdaHandler = createAuthHandler(lambdaHandler);
