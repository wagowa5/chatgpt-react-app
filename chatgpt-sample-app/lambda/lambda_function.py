import json
import boto3
from openai import OpenAI
import os

def lambda_handler(event, context):
    openai_client = OpenAI()
    
    # OpenAI APIキーを環境変数から取得
    openai_client.api_key = os.environ["OPENAI_API_KEY"]
    
    # openai.api_key = os.environ["OPENAI_API_KEY"]

    # 入力メッセージおよびconnection識別のための情報を取得
    data = json.loads(event.get('body', '{}')).get('data')
    domain_name = event.get('requestContext', {}).get('domainName')
    stage = event.get('requestContext', {}).get('stage')
    connectionId = event.get('requestContext', {}).get('connectionId')
    apigw_management = boto3.client(
        'apigatewaymanagementapi', endpoint_url=F"https://YOUR API GATEWAY URL"
    )

    # Request ChatGPT API
    response = openai_client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": data},
        ],
        stream=True
    )

    # メッセージ送信元クライアントに逐次メッセージ送信
    for partial_message in response:
        content = partial_message.choices[0].delta.content
        if content:
            apigw_management.post_to_connection(
                ConnectionId=connectionId,
                Data=content
            )

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "data sent.",
        }),
    }
