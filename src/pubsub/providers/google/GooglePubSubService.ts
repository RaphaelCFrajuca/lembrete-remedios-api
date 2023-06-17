import { PubSub as PubSubGoogle } from "@google-cloud/pubsub";
import { MessageData } from "src/interfaces/ChannelInterface";
import { PubSub } from "src/interfaces/PubSubInterface";
import { Logger } from "src/utils/Logger";

export class GooglePubSubService implements PubSub {
    constructor(private readonly topicName: string, private readonly pubSub = new PubSubGoogle()) {}

    async publish(messageData: MessageData, channel: string): Promise<string> {
        Logger.log("Sending Message to Google Pub/Sub", { messageData, channel });
        return await this.pubSub.topic(this.topicName).publishMessage({ json: { messageData }, attributes: { channel } });
    }
}
