import { Channel, MessageData } from "src/interfaces/ChannelInterface";

export class ChannelProvider implements Channel {
    constructor(private readonly provider: Channel) {}

    send(messageData: MessageData) {
        return this.provider.send(messageData);
    }
}
