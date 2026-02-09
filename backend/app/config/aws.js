const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
require('dotenv').config();

// Initialize DynamoDB client (optional - only if using DynamoDB)
let dynamoClient = null;

if (process.env.AWS_REGION) {
  dynamoClient = new DynamoDBClient({ 
    region: process.env.AWS_REGION || 'us-east-1'
  });
  console.log('AWS DynamoDB client initialized');
}

module.exports = { dynamoClient };
