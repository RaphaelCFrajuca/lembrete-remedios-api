import { MessageData } from "./ChannelInterface";

export interface PubSub {
    publish(messageData: MessageData, channel: string): Promise<string>;
}
