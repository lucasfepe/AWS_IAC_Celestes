const crypto = require('crypto');
const { updateItem, getItem } = require('/opt/DynamoDBDocClient/docClient')
const { AdminGetUserCommand, CognitoIdentityProviderClient } = require("@aws-sdk/client-cognito-identity-provider");

exports.lambdaHandler = async (event, context) => {

  const body = JSON.parse(event.body)

  const notificationType = body.notification_type

  console.log("body: " + JSON.stringify(body));



  const signatureInRequest = event.headers.Authorization.replace("Signature ", "");

  const correctSignature = event.body + "ow4LHc9QfgECAcHr"

  //Loading the crypto module in node.js



  //creating hash object 

  const hash = crypto.createHash('sha1');

  //passing the data to be hashed

  const data = hash.update(correctSignature, 'utf-8');

  //Creating the hash in the required format

  const gen_hash = data.digest('hex');




  if (gen_hash != signatureInRequest) {


    let response = {

      statusCode: '400',

      body: JSON.stringify({

        error: {

          code: "INVALID_SIGNATURE",

          message: "Invalid signature"

        }

      }),

      headers: {

        'Content-Type': 'application/json',

      }

    };




    context.succeed(response);



  }



  if (notificationType == "user_validation") {

    //check to see if the user exists


    let config;

    const client = new CognitoIdentityProviderClient(config);

    const input = { // AdminGetUserRequest

      UserPoolId: "us-east-1_CThpLlXz4", // required

      Username: body.user.email, // required

    };
    const command = new AdminGetUserCommand(input);

    var responseAdminGetUser;

    try {
      responseAdminGetUser = await client.send(command);


      let response = {

        statusCode: '200'



      }
      context.succeed(response);

    } catch (error) {
      for (const key in error) {

      }

      if (error.name == "UserNotFoundException") {

        let response = {

          statusCode: '400',

          body: JSON.stringify({

            error: {

              code: "INVALID_USER",

              message: "Invalid user"

            }

          }),

          headers: {

            'Content-Type': 'application/json',

          }

        }

        context.succeed(response);

      }





    };






  } else if (notificationType == "order_paid") {

    //actually give the user what they bought...!





    const starbuckPurchseAmount = body.items.filter(x => x.sku == "StarbuckSKU").reduce((acc, cur) => {


      acc += cur.quantity;
      return acc;
    }, 0);

    const prevBalRes = await getItem('PlayerStarbuck', body.user.email);
    const prevStarbuckBal = prevBalRes.Starbuck;

    await updateItem('PlayerStarbuck', body.user.email,
      {
        column: 'Starbuck',
        value: prevStarbuckBal + starbuckPurchseAmount
      });
  } else if (notificationType == "payment") {
  }

  let response = {
    statusCode: '200'
  };
  console.log("@16");
  context.succeed(response);
};

