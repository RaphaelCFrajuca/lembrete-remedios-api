import { IsObject, IsString } from "class-validator";

class AmazonMessage {
    @IsString()
    Type?: string;

    @IsString()
    MessageId?: string;

    @IsString()
    Token?: string;

    @IsString()
    TopicArn?: string;

    @IsString()
    Message?: string;

    @IsString()
    SubscribeURL?: string;

    @IsString()
    Timestamp?: string;

    @IsString()
    SignatureVersion?: string;

    @IsString()
    Signature?: string;

    @IsString()
    SigningCertURL?: string;

    @IsObject()
    MessageAttributes?: {
        channel: {
            Type: string;
            Value: string;
        };
    };
}

class GoogleMessage {
    @IsObject()
    message?: {
        attributes: {
            channel: string;
        };
        data: string;
        messageId: string;
        message_id: string;
        publishTime: string;
        publish_time: string;
    };

    @IsString()
    subscription?: string;
}
export interface PubSubRequestDto extends GoogleMessage, AmazonMessage {}
