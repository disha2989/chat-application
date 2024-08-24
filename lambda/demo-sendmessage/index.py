import json
import urllib3
import boto3

client = boto3.client('apigatewaymanagementapi', endpoint_url="https://dxw1cdn64m.execute-api.us-east-1.amazonaws.com/dev")

def lambda_handler(event, context):
    print(event)
    
    #Extract connectionId from incoming event
    connectionId = event["requestContext"]["connectionId"]
    
    #Do something interesting... 
    responseMessage = "Hello there! How may I assist you today?"
    
    #Form response and post back to connectionId
    response = client.post_to_connection(ConnectionId=connectionId, Data=json.dumps(responseMessage).encode('utf-8'))
    return { "statusCode": 200  }
