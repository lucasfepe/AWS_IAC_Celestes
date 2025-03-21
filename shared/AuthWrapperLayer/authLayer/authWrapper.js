// shared/authWrapper.js
const { CognitoJwtVerifier } = require("aws-jwt-verify");
const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    tokenUse: "id",
    clientId: process.env.COGNITO_CLIENT_ID,
});

const createAuthHandler = (handler) => {
    return async (event, context) => {
        try {
            // Extract token from Authorization header
            const token = event?.params?.header?.Authorization;
            if (!token) {
                return {
                    statusCode: 401,
                    body: JSON.stringify({ message: 'No token provided' })
                };
            }
            // Verify token
            const verified = await verifier.verify(token);
            // Add verified user to event object
            event.user = verified;

            // Call original handler
            return await handler(event, context);
        } catch (error) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Invalid token' })
            };
        }
    };
};

module.exports = { createAuthHandler };
