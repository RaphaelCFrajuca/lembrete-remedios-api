import { PubSub as PubSubGoogle } from "@google-cloud/pubsub";
import { MessageData } from "interfaces/ChannelInterface";
import { PubSub } from "interfaces/PubSubInterface";
import { Logger } from "utils/Logger";

export class GooglePubSubService implements PubSub {
    constructor(private readonly topicName: string, private readonly pubSub = new PubSubGoogle()) {}

    async publish(messageData: MessageData, channel: string): Promise<string> {
        Logger.log("Sending Message to Google Pub/Sub", { messageData, channel });
        return await this.pubSub.topic(this.topicName).publishMessage({ json: { messageData }, attributes: { channel } });
    }
}
