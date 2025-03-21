const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");

const ssmClient = new SSMClient({
    region: process.env.REACT_APP_AWS_REGION
});

exports.lambdaHandler = async (event, context) => {
    try {
        const response = await ssmClient.send(
            new GetParameterCommand({
                Name: event.params.querystring.parameterName
            })
        );
        return response.Parameter.Value;
    } catch (error) {
        console.error(`Error fetching parameter ${event.params.querystring.parameterName}:`, error);
        throw error;
    }
}

