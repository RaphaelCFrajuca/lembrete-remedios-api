import { ChannelProvider } from "channels/ChannelProvider";
import { AmazonSESService } from "channels/providers/email/AmazonSESService";
import { BrevoService } from "channels/providers/email/BrevoService";
import { MobizonService } from "channels/providers/sms/MobizonService";
import { NvoipService } from "channels/providers/voicemail/NvoipService";
import { ChannelProviderMap, ChannelProviderType, EmailChannelProviderType, SmsChannelProviderType } from "types/ChannelProviderType";

describe("ChannelProvider (unit)", () => {
    let mockProvider: any;
    let channelProvider: ChannelProvider;

    beforeEach(() => {
        mockProvider = {
            send: jest.fn(),
        };
        channelProvider = new ChannelProvider(mockProvider);
    });

    describe("ChannelProviderMap (unit)", () => {
        describe("EMAIL", () => {
            it("should return a AmazonSESService instance if emailProvider is not specified", () => {
                const factory = ChannelProviderMap[ChannelProviderType.EMAIL].factory;
                const service = factory([
                    "test@example.com",
                    "password",
                    null,
                    null,
                    null,
                    null,
                    null,
                    {
                        accessKeyId: "accessKeyId",
                        secretAccessKey: "secretAccessKey",
                        region: "region",
                    },
                ]);
                expect(service).toBeInstanceOf(AmazonSESService);
            });

            it('should return a BrevoService instance if emailProvider is "brevo"', () => {
                const factory = ChannelProviderMap[ChannelProviderType.EMAIL].factory;
                const service = factory(["test@example.com", "password"], EmailChannelProviderType.BREVO);
                expect(service).toBeInstanceOf(BrevoService);
            });

            it('should return an AmazonSESService instance if emailProvider is "ses"', () => {
                const factory = ChannelProviderMap[ChannelProviderType.EMAIL].factory;
                const service = factory(
                    [
                        "test@example.com",
                        "password",
                        null,
                        null,
                        null,
                        null,
                        null,
                        {
                            accessKeyId: "accessKeyId",
                            secretAccessKey: "secretAccessKey",
                            region: "region",
                        },
                    ],
                    EmailChannelProviderType.SES,
                );
                expect(service).toBeInstanceOf(AmazonSESService);
            });
        });

        describe("SMS", () => {
            it("should return a MobizonService instance if smsProvider is not specified", () => {
                const factory = ChannelProviderMap[ChannelProviderType.SMS].factory;
                const service = factory([null, null, "apiKey", "apiSecret"]);
                expect(service).toBeInstanceOf(MobizonService);
            });

            it('should return a MobizonService instance if smsProvider is "mobizon"', () => {
                const factory = ChannelProviderMap[ChannelProviderType.SMS].factory;
                const service = factory([null, null, "apiKey", "apiSecret"], SmsChannelProviderType.MOBIZON);
                expect(service).toBeInstanceOf(MobizonService);
            });
        });

        describe("VOICEMAIL", () => {
            it("should return a NvoipService instance if voiceMailProvider is not specified", () => {
                const factory = ChannelProviderMap[ChannelProviderType.VOICEMAIL].factory;
                const service = factory([null, null, "apiKey", "apiSecret"]);
                expect(service).toBeInstanceOf(NvoipService);
            });
        });
    });

    it("should call the send method of the underlying provider", () => {
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
        channelProvider.send(messageData);
        expect(mockProvider.send).toHaveBeenCalledWith(messageData);
    });
});
