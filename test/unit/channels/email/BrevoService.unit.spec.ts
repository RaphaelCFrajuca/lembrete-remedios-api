import axios from "axios";
import { BrevoService } from "channels/providers/email/BrevoService";

describe("BrevoService (unit)", () => {
    let service: BrevoService;

    beforeEach(() => {
        service = new BrevoService("apiKey", "apiUrl");
    });

    it("should send an email", async () => {
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
            return { data: null };
        });

        expect(await service.send(messageData)).toBeDefined();
    });

    it("should return error when try to send an email", async () => {
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

        jest.spyOn(axios, "post").mockRejectedValue(new Error("Error when send email") as never);

        expect(service.send(messageData)).rejects.toThrowError("Error when send email");
    });
});
