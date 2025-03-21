const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const {
    GetCommand,
    UpdateCommand,
    ScanCommand,
    DeleteCommand,
    TransactWriteCommand,
    PutCommand
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(client);

async function getItem(tableName, keyValue) {
    try {
        const params = {
            TableName: tableName,
            Key: { Player: keyValue }
        };

        const response = await docClient.send(new GetCommand(params));
        return response.Item;
    } catch (error) {
        console.error("Error getting item:", error);
        throw error;
    }
}

async function putItem(tableName, item) {
    try {
        const params = {
            TableName: tableName,
            Item: item
        };

        const response = await docClient.send(new PutCommand(params));
        return response;
    } catch (error) {
        console.error("Error putting item:", error);
        throw error;
    }
}

async function updateItem(tableName, keyValue, ...updates) {
    if (!tableName || !keyValue || updates.length === 0) {
        console.log("Missing required parameters");
        console.log("out: tbalename: "
            + tableName + " keyvalue: "
            + keyValue + " updates: " +
            JSON.stringify(updates));
        throw new Error('Missing required parameters');
    }

    // Build the update expression and attribute maps
    const expressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};
    console.log("@A: " + tableName);
    updates.forEach((update, index) => {
        if (!update.column || update.value === undefined) {
            throw new Error(`Invalid update object at index ${index}`);
        }

        const placeholder = `:val${index}`;
        expressions.push(`#col${index} = ${placeholder}`);
        expressionAttributeNames[`#col${index}`] = update.column;
        expressionAttributeValues[placeholder] = update.value;
    });
    console.log("@B: " + keyValue);
    console.log(`set ${expressions.join(', ')}`);
    console.log(expressionAttributeNames);
    console.log(expressionAttributeValues);
    const params = {
        TableName: tableName,
        Key: { Player: keyValue },
        UpdateExpression: `set ${expressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW"
    };
    console.log("@C");
    try {
        console.log("@D");
        const response = await docClient.send(new UpdateCommand(params));
        console.log("@E");
        return response.Attributes;
    } catch (error) {
        console.error("Error updating item:", error);
        throw error;
    }
}



async function scanTable(
    tableName,
    filterExpression = null,
    projectionExpression = null,
    attributeNames = null,
    attributeValues = null
) {
    try {
        const params = {
            TableName: tableName,
            // Optional parameters
            ...(filterExpression && { FilterExpression: filterExpression }),
            ...(projectionExpression && { ProjectionExpression: projectionExpression }),
            ...(attributeNames && { ExpressionAttributeNames: attributeNames }),
            ...(attributeValues && { ExpressionAttributeValues: attributeValues })
        };
        console.log(JSON.stringify(params));
        const response = await docClient.send(new ScanCommand(params));
        console.log("Scan succeeded:", response);
        return response;
    } catch (error) {
        console.error("Error scanning table:", error);
        throw error;
    }
}

const deleteItem = async (tableName, keyValue) => {

    // Prepare the parameters
    const params = {
        TableName: tableName,
        Key: { Player: keyValue }
    };

    try {
        const command = new DeleteCommand(params);
        const response = await docClient.send(command);
        console.log("Item deleted successfully:", response);
        return response;
    } catch (error) {
        console.error("Error deleting item:", error);
        throw error;
    }
};


const purchaseTransaction = async (
    user,
    tableName,
    tableColumn,
    currencyAfterTransaction,
    cardInventory
) => {

    const params = {
        TransactItems: [{
            Update: {
                TableName: 'PlayerCards',
                Key: { Player: user },
                UpdateExpression: 'set #d = :d',
                ExpressionAttributeNames: { '#d': 'CardInventory' },
                ExpressionAttributeValues: {
                    ':d': cardInventory
                }
            }
        }, {
            Update: {
                TableName: tableName,
                Key: { Player: user },
                UpdateExpression: 'set #d = :d',
                ExpressionAttributeNames: { '#d': tableColumn },
                ExpressionAttributeValues: {
                    ':d': currencyAfterTransaction
                }
            }
        }]
    };

    try {
        const command = new TransactWriteCommand(params);
        const response = await docClient.send(command);
        console.log("Transaction completed successfully:", response);
        return response;
    } catch (error) {
        if (error.name === 'TransactionCanceledException') {
            // Handle cancelled transaction
            console.error("Transaction cancelled:", error.CancellationReasons);
        }
        console.error("Transaction error:", error);
        throw error;
    }
};

module.exports = {
    getItem,
    updateItem,
    scanTable,
    deleteItem,
    purchaseTransaction,
    putItem
};


