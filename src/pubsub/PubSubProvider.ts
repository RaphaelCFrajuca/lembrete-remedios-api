import { MessageData } from "interfaces/ChannelInterface";
import { PubSub } from "interfaces/PubSubInterface";

export class PubSubProvider implements PubSub {
    constructor(private readonly provider: PubSub) {}

    async publish(messageData: MessageData, channel: string): Promise<string> {
        return await this.provider.publish(messageData, channel);
    }
}
