import { HttpStatus } from "@nestjs/common";
import axios from "axios";
import { Channel, MessageData } from "interfaces/ChannelInterface";
import { CustomException } from "utils/Errors/CustomException";

export class BrevoService implements Channel {
    constructor(private readonly apiKey: string, private readonly apiUrl: string) {}

    async send(messageData: MessageData) {
        try {
            const payloadData = {
                to: [
                    {
                        email: messageData.email,
                        name: messageData.name.split(" ")[0],
                    },
                ],
                templateId: 1,
                params: {
                    NOME: messageData.name.split(" ")[0],
                    REMEDIO: messageData.reminder.medication,
                    HORARIO: messageData.reminder.hour,
                },
                headers: {
                    charset: "iso-8859-1",
                },
            };
            return (await axios.post(this.apiUrl, payloadData, { headers: { "api-key": this.apiKey } })).data;
        } catch (error) {
            throw new CustomException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
