import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
const client = new DynamoDBClient();

export const handler = async (event) => {
  console.log('event', event);
  const connectionId = event. requestContext.connectionId;
  const input = {
    "Item" : {
      "connection_id" : {
        "S": connectionId
      }
    },
    "TableName" : "user"
  }
  
  try {
    const command = new PutItemCommand(input);
    const response = await client.send(command);
    return {"statusCode": 200 };
  }
  catch(error) {
    console. log("Error:", error)
    return { "statusCode": 500, "message": "Error, please try egain" };
  }
};
