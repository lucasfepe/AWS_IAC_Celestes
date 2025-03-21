const { getItem, updateItem } = require('/opt/DynamoDBDocClient/docClient')

const PLAYER_SKILL_TABLE_NAME = 'PlayerSkill';

exports.lambdaHandler = async (event, context) => {

  // const timezone = "America/Calgary"
  // const now = new Date()
  // const currentTimeInCalgary = new Intl.DateTimeFormat('en-CA', {
  //   timeZone: timezone,
  //   timeStyle: 'medium',
  //   hour12: false
  // }).format(now);

  const now = Date.now()
  var winnerRecentVictories = [];

  //increase stardust for winner
  //get midnight of current day in (server timezone nvirginia GMT-5)
  var d = new Date();
  d.setHours(0, 0, 0, 0);
  const midnight = d.getTime()
  console.log("midnight: " + midnight)



  var stardustReward = 0;
  try {
    console.log("@1");
    const data = await getItem(PLAYER_SKILL_TABLE_NAME, event.winner_email);
    console.log("@2: " + JSON.stringify(data.RecentVictories));
    winnerRecentVictories = JSON.parse(JSON.stringify(data.RecentVictories));
    console.log(winnerRecentVictories);
    console.log(!winnerRecentVictories[0]);
    if (!winnerRecentVictories[0] || winnerRecentVictories[0] < midnight) {
      //first victory today
      stardustReward = 50
      console.log("FIRST VICTORY TODAY")
    } else if (!winnerRecentVictories[1] || winnerRecentVictories[1] < midnight) {
      //second victory today
      stardustReward = 25
      console.log("SECOND VICTORY TODAY")
    } else if (!winnerRecentVictories[2] || winnerRecentVictories[2] < midnight) {
      //third victory today
      console.log("THIRD VICTORY TODAY")
      stardustReward = 25
    } else {
      //regular victory
      stardustReward = 10

    }
    //EDIT recent victory object to insert updated bellow
    console.log("winnerRecentVictories: " + winnerRecentVictories)
    winnerRecentVictories.map((x, i) => console.log("winnerRecentVictories[" + i + "]: " + x))

    winnerRecentVictories.unshift(now)
    // winnerRecentVictories.map((x, i) => console.log("winnerRecentVictories[" + i + "]: " + x))

    winnerRecentVictories.length = 3
    // winnerRecentVictories.map((x, i) => console.log("winnerRecentVictories[" + i + "]: " + x))

  } catch (err) {
    return { error: err };
  }

  //insert latest victory

  try {
    console.log('@3');
    const res = await updateItem(PLAYER_SKILL_TABLE_NAME, event.winner_email,
      {
        column: 'RecentVictories',
        value: winnerRecentVictories
      });
    console.log('@4');


  } catch (err) {
    return { error: err };
  }

  //add stardust reward


  var stardustWinner = 0;
  try {

    const dataWinner = await getItem(PLAYER_SKILL_TABLE_NAME, event.winner_email);
    stardustWinner = dataWinner.Stardust;
    console.log("stardustWinner: " + stardustWinner)
  } catch (err) {
    return { error: err };
  }
  console.log("stardustReward: " + stardustReward)
  console.log("newstardust: " + (stardustReward + stardustWinner))

  try {
    const res = await updateItem(PLAYER_SKILL_TABLE_NAME, event.winner_email,
      {
        column: 'Stardust',
        value: stardustWinner + stardustReward
      });


  } catch (err) {
    return { error: err };
  }
  if (event.ranked == false) {
    return stardustReward
  }

  //only RANKED
  console.log("RANKED")

  var skillWinner;
  var skillLooser;
  try {

    const dataWinner = await getItem(PLAYER_SKILL_TABLE_NAME, event.winner_email);
    const dataLooser = await getItem(PLAYER_SKILL_TABLE_NAME, event.looser_email);
    skillWinner = dataWinner.Skill;
    skillLooser = dataLooser.Skill;
  } catch (err) {
    return { error: err };
  }

  try {
    const res1 = await updateItem(PLAYER_SKILL_TABLE_NAME, event.winner_email,
      {
        column: 'Skill',
        value: skillWinner + 10
      });
    if (skillLooser >= 600) {
      const res2 = await updateItem(PLAYER_SKILL_TABLE_NAME, event.looser_email,
        {
          column: 'Skill',
          value: skillLooser - 10
        });
    }

    return stardustReward;
  } catch (err) {
    return { error: err };
  }

};

