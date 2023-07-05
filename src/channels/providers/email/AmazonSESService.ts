import { Channel, MessageData } from "interfaces/ChannelInterface";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import * as fs from "fs";

export class AmazonSESService implements Channel {
    constructor(private readonly accessKeyId: string, private readonly secretAccessKey: string, private readonly region: string) {}

    async send(messageData: MessageData) {
        const sesClient = new SESClient({
            region: this.region,
            credentials: {
                accessKeyId: this.accessKeyId,
                secretAccessKey: this.secretAccessKey,
            },
        });
        const params = {
            Destination: {
                CcAddresses: [],
                ToAddresses: [messageData.email],
            },
            Message: {
                Body: {
                    Html: {
                        Charset: "UTF-8",
                        Data: fs
                            .readFileSync("src/channels/providers/email/template.html", "utf8")
                            .replaceAll(":{name}", messageData.name.split(" ")[0])
                            .replaceAll(":{medicationName}", messageData.reminder.medication)
                            .replaceAll(":{hour}", messageData.reminder.hour),
                    },
                },
                Subject: {
                    Charset: "UTF-8",
                    Data: `Olá ${messageData.name.split(" ")[0]}, lembrete de tomar o seu ${messageData.reminder.medication}!`,
                },
            },
            Source: "Lembrete Rem\xC3\xA9dios <nao-responder@bedi.com.br>",
            ReplyToAddresses: [],
        };
        try {
            const data = await sesClient.send(new SendEmailCommand(params));
            return data;
        } catch (error) {
            console.error(error);
        }
    }
}
