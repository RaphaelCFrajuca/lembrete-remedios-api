import { ChannelProvider } from "channels/ChannelProvider";

describe("ChannelProvider (unit)", () => {
    let mockProvider: any;
    let channelProvider: ChannelProvider;

    beforeEach(() => {
        mockProvider = {
            send: jest.fn(),
        };
        channelProvider = new ChannelProvider(mockProvider);
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
