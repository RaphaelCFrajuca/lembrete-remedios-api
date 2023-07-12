import { SESClient } from "@aws-sdk/client-ses";
import { AmazonSESService } from "channels/providers/email/AmazonSESService";

describe("AmazonSESService (unit)", () => {
    let service: AmazonSESService;

    beforeEach(() => {
        service = new AmazonSESService("accessKeyId", "secretAccessKey", "region");
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

        jest.spyOn(SESClient.prototype, "send").mockImplementation(() => null);

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

        jest.spyOn(SESClient.prototype, "send").mockRejectedValue(new Error("Error when send email") as never);

        expect(service.send(messageData)).rejects.toThrowError("Error when send email");
    });
});
