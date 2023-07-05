import { HttpStatus } from "@nestjs/common";
import axios from "axios";
import { Channel, MessageData } from "interfaces/ChannelInterface";
import { CustomException } from "utils/Errors/CustomException";

export class NvoipService implements Channel {
    constructor(private readonly sip: string, private readonly userToken: string, private readonly apiUrl: string) {}

    async send(messageData: MessageData) {
        try {
            const payloadData = {
                caller: this.sip,
                called: messageData.phone.replace("+55", ""),
                audios: [
                    {
                        audio: `Olá ${messageData.name.split(" ")[0]}`,
                        positionAudio: 1,
                    },
                    {
                        audio: "Aqui é o lembrete remédios, tudo bem?",
                        positionAudio: 2,
                    },
                    {
                        audio: "Temos um lembrete!",
                        positionAudio: 3,
                    },
                    {
                        audio: `Você deve tomar ${messageData.reminder.medication} agora!`,
                        positionAudio: 4,
                    },
                    {
                        audio: `Muito obrigado pela atenção, tchau!`,
                        positionAudio: 5,
                    },
                ],
                dtmfs: [],
            };
            return (await axios.post(`${this.apiUrl}/torpedo/voice`, payloadData, { headers: { Authorization: `Bearer ${await this.getUserToken()}` } })).data;
        } catch (error) {
            throw new CustomException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getUserToken() {
        try {
            return (
                await axios.post(`${this.apiUrl}/oauth/token?username=${this.sip}&password=${this.userToken}&grant_type=password`, null, {
                    headers: { Authorization: "Basic TnZvaXBBcGlWMjpUblp2YVhCQmNHbFdNakl3TWpFPQ==" },
                })
            ).data.access_token;
        } catch (error) {
            throw new CustomException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
