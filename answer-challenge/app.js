import { createAuthHandler } from '/opt/authLayer/authWrapper'
import { calculateSignature, getNowString } from 'amazon-user-pool-srp-client';

const lambdaHandler = async (event, context) => {
  const userIdForSrp = event.USER_ID_FOR_SRP;
  const srpB = event.SRP_B;
  const salt = event.SALT;
  const secretBlock = event.SECRET_BLOCK;


  const hkdf = srp.getPasswordAuthenticationKey(
    userIdForSrp,
    pin, // This is the user's password
    srpB,
    salt,
  );
  const dateNow = getNowString();
  const signatureString = calculateSignature(
    hkdf,
    userPoolId,
    userIdForSrp,
    secretBlock,
    dateNow,
  );


  const respondToAuthParams = {
    ClientId: appClientId,
    ChallengeName: "PASSWORD_VERIFIER",
    ChallengeResponses: {
      PASSWORD_CLAIM_SIGNATURE: signatureString,
      PASSWORD_CLAIM_SECRET_BLOCK: secretBlock,
      TIMESTAMP: dateNow,
      USERNAME: userIdForSrp,
    }
  };
  const respondToAuthCommand = new RespondToAuthChallengeCommand(
    respondToAuthParams,
  );


  try {


    const respondToAuthResponse = await this.provider.send(
      respondToAuthCommand,
    );
    console.log("re: " + respondToAuthResponse);

    return respondToAuthResponse;
  } catch (err) {
    return { error: err };
  }

};

exports.lambdaHandler = createAuthHandler(lambdaHandler);

