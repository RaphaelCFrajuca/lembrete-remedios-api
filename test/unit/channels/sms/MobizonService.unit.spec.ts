import axios from "axios";
import { MobizonService } from "channels/providers/sms/MobizonService";

describe("MobizonService (unit)", () => {
    let service: MobizonService;

    beforeEach(() => {
        service = new MobizonService("apiKey", "apiUrl");
    });

    it("should send an sms", async () => {
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

    it("should return error when try to send an sms", async () => {
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
