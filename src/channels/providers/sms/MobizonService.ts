import { HttpStatus } from "@nestjs/common";
import axios from "axios";
import { Channel, MessageData } from "interfaces/ChannelInterface";
import { CustomException } from "utils/Errors/CustomException";

export class MobizonService implements Channel {
    constructor(private readonly apiKey: string, private readonly apiUrl: string) {}

    async send(messageData: MessageData) {
        try {
            const payloadData = {
                recipient: messageData.phone,
                text: `Olá ${messageData.name.split(" ")[0]}, aqui é o Lembrete Remédios, você deve tomar ${messageData.reminder.medication} agora!`,
            };
            return (await axios.post(`${this.apiUrl}?apiKey=${this.apiKey}`, payloadData)).data;
        } catch (error) {
            throw new CustomException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
