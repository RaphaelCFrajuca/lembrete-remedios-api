import axios from "axios";
import { NvoipService } from "channels/providers/voicemail/NvoipService";

describe("NvoipService (unit)", () => {
    let service: NvoipService;

    beforeEach(() => {
        service = new NvoipService("sip", "userToken", "apiUrl");
    });

    it("should send an voicemail", async () => {
        const messageData = {
            name: "John Doe",
            email: "johndoe@example.com",
            phone: "5511999999999",
            channel: "email",
            reminder: {
                medication: "Aspirin",
                hour: "08:00",
            },
        };

        jest.spyOn(axios, "post").mockImplementation(async () => {
            return {
                data: {
                    access_token: "token",
                },
            };
        });

        expect(await service.send(messageData)).toBeDefined();
    });

    it("should return error when try to send an voicemail", async () => {
        const messageData = {
            name: "John Doe",
            email: "johndoe@example.com",
            phone: "5511999999999",
            channel: "email",
            reminder: {
                medication: "Aspirin",
                hour: "08:00",
            },
        };

        jest.spyOn(axios, "post").mockRejectedValue(new Error("Error when send sms") as never);

        expect(service.send(messageData)).rejects.toThrowError("Error when send sms");
    });
});
