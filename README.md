# newprojectLambdaVSC

Welcome to **newprojectLambdaVSC**, a serverless application built using the AWS Serverless Application Model (AWS SAM). This project leverages AWS Lambda functions, DynamoDB, Cognito, IAM Roles, and Lambda Layers to deliver a scalable and modular backend service.

## 🚀 Project Overview

This repository includes:
- AWS SAM Template (`template.yaml`) to define the cloud infrastructure
- AWS Lambda functions written in **Node.js 18.x**
- Multiple IAM Roles to handle fine-grained permissions for Lambda functions interacting with DynamoDB and Cognito
- Two shared **Lambda Layers**:
  - **AuthWrapperLayer**: Handles authentication before the Lambda function executes (`shared/layers/authLayer.zip`)
  - **DynamoDBClientLayer**: Provides a reusable DynamoDB connection (`shared/layers/DynamoDBDocClient.zip`)
- Environment variables managed securely via AWS Systems Manager (SSM) Parameter Store
## 🏗️ Architecture Diagram  

The diagram below illustrates how **Celestes CCG** integrates various AWS services for **game hosting, authentication, backend services, and CI/CD deployment**.  

![Celestes CCG Architecture](public/CloudArchitecture.png)
