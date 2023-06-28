import { MessageData } from "src/interfaces/ChannelInterface";
import { PubSub } from "src/interfaces/PubSubInterface";
import { Logger } from "src/utils/Logger";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { PubSubCredentials } from "src/types/PubSubProviderType";

export class AmazonPubSubService implements PubSub {
    constructor(private readonly topicName: string, private readonly credentials: PubSubCredentials) {}

    async publish(messageData: MessageData, channel: string): Promise<string> {
        Logger.log("Sending Message to Amazon Pub/Sub", { messageData, channel });
        const sns = new SNSClient({
            region: this.credentials.amazon.region,
            credentials: {
                accessKeyId: this.credentials.amazon.accessKeyId,
                secretAccessKey: this.credentials.amazon.secretAccessKey,
            },
        });
        const params = {
            Message: JSON.stringify(messageData),
            TopicArn: this.topicName,
            MessageAttributes: {
                channel: {
                    DataType: "String",
                    StringValue: channel,
                },
            },
        };
        return (await sns.send(new PublishCommand(params))).$metadata.requestId;
    }
}
