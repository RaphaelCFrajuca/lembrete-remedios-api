import { MessageData } from "src/interfaces/ChannelInterface";
import { PubSub } from "src/interfaces/PubSubInterface";

export class PubSubProvider implements PubSub {
    constructor(private readonly provider: PubSub) {}

    async publish(messageData: MessageData, channel: string): Promise<string> {
        return await this.provider.publish(messageData, channel);
    }
}
