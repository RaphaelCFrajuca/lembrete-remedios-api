import { ExecutionContext, INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { UserGuard } from "guards/UserGuard";
import * as request from "supertest";
import { EnvironmentModuleFake } from "../fake/environment/EnvironmentModuleFake";
import { DatabaseModuleFake } from "../fake/database/DatabaseModuleFake";
import { DatabaseProvider } from "database/DatabaseProvider";
import { ReminderController } from "controllers/reminder/ReminderController";
import { ReminderService } from "services/ReminderService";
import { ReminderBase, ReminderUser } from "interfaces/ReminderInterface";
import { PubSubProvider } from "pubsub/PubSubProvider";
import { ChannelProviderType } from "types/ChannelProviderType";
import { User } from "interfaces/UserInterface";
import { ChannelService, MessageData } from "interfaces/ChannelInterface";
import { AmazonMessage, GoogleMessage } from "controllers/dto/PubSubRequestDto";
import axios from "axios";

describe("ReminderController (e2e)", () => {
    let app: INestApplication;
    let databaseProvider: DatabaseProvider;
    let pubSubProvider: PubSubProvider;
    let reminderService: ReminderService;
    let channelService: ChannelService;

    const mockReminderList: ReminderUser[] = [
        {
            uniqueId: 1234567890,
            key: 1,
            level: 0,
            name: "Test User",
            reminderList: [
                {
                    uniqueId: 1234567890,
                    key: 1,
                    level: 1,
                    dayOfWeek: "Terça-feira",
                    reminders: [
                        {
                            level: 2,
                            key: 1,
                            uniqueId: 1234567890,
                            medication: "Existing Medication",
                            hour: "09:00",
                        },
                    ],
                },
            ],
        },
    ];
    const mockUser: User = {
        nickname: "Test User",
        name: "Test User",
        reminderChannel: ChannelProviderType.DEFAULT,
        given_name: "Test",
        family_name: "User",
        locale: "pt-BR",
        picture: "https://fake.com/fake.png",
        email: "fake@fake.com",
        phone: "5511999999999",
        email_verified: true,
    };

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [EnvironmentModuleFake, DatabaseModuleFake],
            controllers: [ReminderController],
            providers: [
                ReminderService,
                {
                    provide: "CHANNEL_SERVICE",
                    useValue: {
                        email: {
                            send: jest.fn(),
                        },
                        sms: {
                            send: jest.fn(),
                        },
                        voicemail: {
                            send: jest.fn(),
                        },
                    },
                },
                {
                    provide: "PUBSUB_SERVICE",
                    useValue: {
                        publish: jest.fn(),
                    },
                },
            ],
        })
            .overrideGuard(UserGuard)
            .useValue({
                canActivate: (context: ExecutionContext) => {
                    const request = context.switchToHttp().getRequest();
                    const user = {
                        given_name: "Test",
                        family_name: "User",
                        nickname: "testuser",
                        name: "Test User",
                        picture: "http://fake.com/fake.png",
                        locale: "pt-BR",
                        updated_at: "2023-07-05T02:09:16.822Z",
                        email: "fake@fake.com",
                        email_verified: true,
                        iss: "http://fake.com/",
                        aud: "hjdjvghKHJVNDSKJVN",
                        iat: 1688614543,
                        exp: 1688650543,
                        sub: "google-oauth2|54285734968437698428572",
                        sid: "dskjgldsgn",
                        nonce: "gfjdshgiksduhgdskgjhsdfbksd",
                    };
                    request["user"] = user;
                    return true;
                },
            })
            .compile();
        app = moduleRef.createNestApplication();
        app.enableCors();
        app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
            }),
        );
        await app.init();
        databaseProvider = moduleRef.get<DatabaseProvider>("DATABASE_SERVICE");
        reminderService = moduleRef.get<ReminderService>(ReminderService);
        pubSubProvider = moduleRef.get<PubSubProvider>("PUBSUB_SERVICE");
        channelService = moduleRef.get<ChannelService>("CHANNEL_SERVICE");
    });

    afterEach(async () => {
        await app.close();
        await databaseProvider.destroy();
    });

    describe("/reminder", () => {
        it("should get reminders", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);

            await databaseProvider.newReminders(mockReminderList, "fake@fake.com");

            const response = await request(app.getHttpServer()).get("/reminder").query({
                email: "fake@fake.com",
            });
            expect(response.body).toEqual(mockReminderList);
        });

        it("should get empty string when have no reminder for this user", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);

            const response = await request(app.getHttpServer()).get("/reminder").query({
                email: "fake@fake.com",
            });
            expect(response.body).toEqual("");
        });

        it("should get an error when try to get reminders for other user than provided in jwt", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);

            const response = await request(app.getHttpServer()).get("/reminder").query({
                email: "fake-not-my-user@fake.com",
            });
            expect(response.body).toEqual({ message: "User fake@fake.com not authorized to get fake-not-my-user@fake.com reminders", statusCode: 403 });
        });
    });

    describe("/reminder/name", () => {
        it("should get reminder user name", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);

            await databaseProvider.newReminders(mockReminderList, "fake@fake.com");

            const response = await request(app.getHttpServer()).get("/reminder/name");
            expect(response.body).toEqual(["Test User"]);
        });

        it("should get empty reminder user name when have no reminder for this user", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);
            const response = await request(app.getHttpServer()).get("/reminder/name");
            expect(response.body).toEqual([]);
        });
    });

    describe("/reminder/new", () => {
        it("should create a new reminder when passing reminder base", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);
            const response = await request(app.getHttpServer())
                .post("/reminder/new")
                .set("Content-Type", "application/json")
                .send({
                    fullName: "Test User Reminder",
                    medicationName: "Test Medication",
                    daysOfWeek: ["Segunda-feira", "Terça-feira"],
                    hour: "12:00",
                } as ReminderBase);
            expect(response.body).toEqual({
                status: "success",
                message: `Reminders of fake@fake.com created`,
            });
            expect(await databaseProvider.getReminders("fake@fake.com")).toEqual([
                {
                    key: 1,
                    level: 0,
                    name: "Test User Reminder",
                    reminderList: [
                        {
                            dayOfWeek: "Segunda-feira",
                            key: 1,
                            level: 1,
                            reminders: [{ hour: "12:00", key: 1, level: 2, medication: "Test Medication", uniqueId: expect.any(Number) }],
                            uniqueId: expect.any(Number),
                        },
                        {
                            dayOfWeek: "Terça-feira",
                            key: 2,
                            level: 1,
                            reminders: [{ hour: "12:00", key: 1, level: 2, medication: "Test Medication", uniqueId: expect.any(Number) }],
                            uniqueId: expect.any(Number),
                        },
                    ],
                    uniqueId: expect.any(Number),
                },
            ]);
        });

        it("should not create a new reminder when passing invalid reminder base", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);
            const response = await request(app.getHttpServer())
                .post("/reminder/new")
                .set("Content-Type", "application/json")
                .send({
                    fullNameError: "Test User Reminder",
                    medicationNameError: "Test Medication",
                    daysOfWeekError: ["Segunda-feira", "Terça-feira"],
                    hourError: "12:00",
                });
            expect(response.body).toEqual({
                statusCode: 400,
                message: [
                    "fullName must be a string",
                    "fullName should not be empty",
                    "medicationName must be a string",
                    "medicationName should not be empty",
                    "each value in daysOfWeek must be one of the following values: Segunda-feira, Terça-feira, Quarta-feira, Quinta-feira, Sexta-feira, Sábado, Domingo",
                    "each value in daysOfWeek must be a string",
                    "daysOfWeek should not be empty",
                    "daysOfWeek must contain at least 1 elements",
                    "daysOfWeek must be an array",
                    "hour must be a string",
                    "hour should not be empty",
                ],
                error: "Bad Request",
            });
        });
    });

    describe("/reminder/schedule", () => {
        it("should not schedule reminders when is not reminders to schedule", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);
            const pubSubSpy = jest.spyOn(pubSubProvider, "publish");
            const response = await request(app.getHttpServer()).post("/reminder/schedule").set("Content-Type", "application/json");
            expect(response.body).toEqual({
                status: "success",
                message: "No reminders to schedule",
            });
            expect(pubSubSpy).not.toHaveBeenCalled();
        });

        it("should schedule reminders when is reminders to schedule", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);
            jest.spyOn(reminderService, "getDateHourUTCMinus3").mockImplementation(() => {
                return {
                    dayWeek: "Terça-feira",
                    actualHour: "09:00",
                };
            });

            const mockMessageData: MessageData = {
                email: mockUser.email,
                channel: mockUser.reminderChannel,
                name: mockUser.name,
                phone: mockUser.phone,
                reminder: {
                    hour: mockReminderList[0].reminderList[0].reminders[0].hour,
                    medication: mockReminderList[0].reminderList[0].reminders[0].medication,
                },
            };

            const pubSubSpy = jest.spyOn(pubSubProvider, "publish");
            await databaseProvider.registerUser(mockUser);
            await databaseProvider.newReminders(mockReminderList, "fake@fake.com");
            const response = await request(app.getHttpServer()).post("/reminder/schedule").set("Content-Type", "application/json");
            expect(response.body).toEqual({
                status: "success",
                message: "Reminders scheduled",
            });
            expect(pubSubSpy).toHaveBeenCalledTimes(1);
            expect(pubSubSpy).toHaveBeenCalledWith(mockMessageData, mockUser.reminderChannel.toLowerCase());
        });
    });

    describe("/reminder/send", () => {
        it("should send reminder when user agent is from Google Pub/Sub", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);

            const mockMessageData: MessageData = {
                email: mockUser.email,
                channel: mockUser.reminderChannel,
                name: mockUser.name,
                phone: mockUser.phone,
                reminder: {
                    hour: mockReminderList[0].reminderList[0].reminders[0].hour,
                    medication: mockReminderList[0].reminderList[0].reminders[0].medication,
                },
            };
            const mockPubSubMessage: GoogleMessage = {
                message: {
                    attributes: { channel: ChannelProviderType.DEFAULT },
                    data: Buffer.from(JSON.stringify({ messageData: mockMessageData })).toString("base64"),
                    messageId: "123456789",
                    message_id: "123456789",
                    publishTime: "2023-06-17T22:43:51.179Z",
                    publish_time: "2023-06-17T22:43:51.179Z",
                },
                subscription: "projects/fake-project/subscriptions/fake-subscription",
            };
            const response = await request(app.getHttpServer())
                .post("/reminder/send")
                .set("Content-Type", "application/json")
                .set("User-Agent", "CloudPubSub-Google")
                .send(JSON.stringify(mockPubSubMessage));
            expect(response.body).toEqual({
                status: "success",
                message: "Message Dispatched",
            });
            let channelSpy;
            switch (mockMessageData.channel) {
                case ChannelProviderType.EMAIL:
                    channelSpy = jest.spyOn(channelService.email, "send");
                    break;
                case ChannelProviderType.SMS:
                    channelSpy = jest.spyOn(channelService.sms, "send");
                    break;
                case ChannelProviderType.VOICEMAIL:
                    channelSpy = jest.spyOn(channelService.voicemail, "send");
                    break;
            }
            expect(channelSpy).toHaveBeenCalledTimes(1);
            expect(channelSpy).toHaveBeenCalledWith(mockMessageData);
        });

        it("should send reminder when user agent is from Amazon Pub/Sub (SNS)", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);

            const mockMessageData: MessageData = {
                email: mockUser.email,
                channel: mockUser.reminderChannel,
                name: mockUser.name,
                phone: mockUser.phone,
                reminder: {
                    hour: mockReminderList[0].reminderList[0].reminders[0].hour,
                    medication: mockReminderList[0].reminderList[0].reminders[0].medication,
                },
            };
            const mockPubSubMessage: AmazonMessage = {
                Type: "Notification",
                MessageId: "123456789",
                TopicArn: "arn:aws:sns:us-east-1:123456789:fake-topic",
                Message: JSON.stringify(mockMessageData),
                Timestamp: "2023-06-17T22:43:51.179Z",
                SignatureVersion: "1",
                MessageAttributes: {
                    channel: {
                        Type: "String",
                        Value: ChannelProviderType.DEFAULT,
                    },
                },
                Signature: "fake-signature",
                SigningCertURL: "https://sns.us-east-1.amazonaws.com/SimpleNotificationService-fake.pem",
                SubscribeURL: "https://sns.us-east-1.amazonaws.com/?Action=...",
                Token: "fake-token",
            };
            const response = await request(app.getHttpServer())
                .post("/reminder/send")
                .set("Content-Type", "application/json")
                .set("User-Agent", "Amazon Simple Notification Service Agent")
                .send(JSON.stringify(mockPubSubMessage));
            expect(response.body).toEqual({
                status: "success",
                message: "Message Dispatched",
            });
            let channelSpy;
            switch (mockMessageData.channel) {
                case ChannelProviderType.EMAIL:
                    channelSpy = jest.spyOn(channelService.email, "send");
                    break;
                case ChannelProviderType.SMS:
                    channelSpy = jest.spyOn(channelService.sms, "send");
                    break;
                case ChannelProviderType.VOICEMAIL:
                    channelSpy = jest.spyOn(channelService.voicemail, "send");
                    break;
            }
            expect(channelSpy).toHaveBeenCalledTimes(1);
            expect(channelSpy).toHaveBeenCalledWith(mockMessageData);
        });

        it("should not send reminder when user agent is from Amazon Pub/Sub (SNS) and reminder is not valid", async () => {
            jest.spyOn(console, "error").mockImplementation(() => null);

            const mockMessageData = {
                emailError: mockUser.email,
                channelError: mockUser.reminderChannel,
                nameError: mockUser.name,
                phoneError: mockUser.phone,
                reminderError: {
                    hourError: mockReminderList[0].reminderList[0].reminders[0].hour,
                    medicationError: mockReminderList[0].reminderList[0].reminders[0].medication,
                },
            };
            const mockPubSubMessage: AmazonMessage = {
                Type: "Notification",
                MessageId: "123456789",
                TopicArn: "arn:aws:sns:us-east-1:123456789:fake-topic",
                Message: JSON.stringify(mockMessageData),
                Timestamp: "2023-06-17T22:43:51.179Z",
                SignatureVersion: "1",
                MessageAttributes: {
                    channel: {
                        Type: "String",
                        Value: ChannelProviderType.DEFAULT,
                    },
                },
                Signature: "fake-signature",
                SigningCertURL: "https://sns.us-east-1.amazonaws.com/SimpleNotificationService-fake.pem",
                SubscribeURL: "https://sns.us-east-1.amazonaws.com/?Action=...",
                Token: "fake-token",
            };
            const response = await request(app.getHttpServer())
                .post("/reminder/send")
                .set("Content-Type", "application/json")
                .set("User-Agent", "Amazon Simple Notification Service Agent")
                .send(JSON.stringify(mockPubSubMessage));
            expect(response.body).toEqual({
                status: "error",
                message: "Invalid Message Data",
            });
            let channelSpy;
            switch (mockMessageData.channelError) {
                case ChannelProviderType.EMAIL:
                    channelSpy = jest.spyOn(channelService.email, "send");
                    break;
                case ChannelProviderType.SMS:
                    channelSpy = jest.spyOn(channelService.sms, "send");
                    break;
                case ChannelProviderType.VOICEMAIL:
                    channelSpy = jest.spyOn(channelService.voicemail, "send");
                    break;
            }
            expect(channelSpy).toHaveBeenCalledTimes(0);
            expect(channelSpy).not.toHaveBeenCalled();
        });

        it("should not send reminder when user agent is from Google Pub/Sub and reminder is not valid", async () => {
            jest.spyOn(console, "error").mockImplementation(() => null);

            const mockMessageData = {
                emailError: mockUser.email,
                channelError: mockUser.reminderChannel,
                nameError: mockUser.name,
                phoneError: mockUser.phone,
                reminder: {
                    hourError: mockReminderList[0].reminderList[0].reminders[0].hour,
                    medicationError: mockReminderList[0].reminderList[0].reminders[0].medication,
                },
            };
            const mockPubSubMessage: GoogleMessage = {
                message: {
                    attributes: { channel: ChannelProviderType.DEFAULT },
                    data: Buffer.from(JSON.stringify({ messageData: mockMessageData })).toString("base64"),
                    messageId: "123456789",
                    message_id: "123456789",
                    publishTime: "2023-06-17T22:43:51.179Z",
                    publish_time: "2023-06-17T22:43:51.179Z",
                },
                subscription: "projects/fake-project/subscriptions/fake-subscription",
            };
            const response = await request(app.getHttpServer())
                .post("/reminder/send")
                .set("Content-Type", "application/json")
                .set("User-Agent", "CloudPubSub-Google")
                .send(JSON.stringify(mockPubSubMessage));
            expect(response.body).toEqual({
                status: "error",
                message: "Invalid Message Data",
            });
            let channelSpy;
            switch (mockMessageData.channelError) {
                case ChannelProviderType.EMAIL:
                    channelSpy = jest.spyOn(channelService.email, "send");
                    break;
                case ChannelProviderType.SMS:
                    channelSpy = jest.spyOn(channelService.sms, "send");
                    break;
                case ChannelProviderType.VOICEMAIL:
                    channelSpy = jest.spyOn(channelService.voicemail, "send");
                    break;
            }
            expect(channelSpy).toHaveBeenCalledTimes(0);
            expect(channelSpy).not.toHaveBeenCalled();
        });

        it("should not send reminder when user agent is invalid", async () => {
            jest.spyOn(console, "error").mockImplementation(() => null);

            const mockMessageData = {
                email: mockUser.email,
                channel: mockUser.reminderChannel,
                name: mockUser.name,
                phone: mockUser.phone,
                reminder: {
                    hour: mockReminderList[0].reminderList[0].reminders[0].hour,
                    medication: mockReminderList[0].reminderList[0].reminders[0].medication,
                },
            };
            const mockPubSubMessage: GoogleMessage = {
                message: {
                    attributes: { channel: ChannelProviderType.DEFAULT },
                    data: Buffer.from(JSON.stringify({ messageData: mockMessageData })).toString("base64"),
                    messageId: "123456789",
                    message_id: "123456789",
                    publishTime: "2023-06-17T22:43:51.179Z",
                    publish_time: "2023-06-17T22:43:51.179Z",
                },
                subscription: "projects/fake-project/subscriptions/fake-subscription",
            };
            const response = await request(app.getHttpServer())
                .post("/reminder/send")
                .set("Content-Type", "application/json")
                .set("User-Agent", "Invalid User Agent")
                .send(JSON.stringify(mockPubSubMessage));
            expect(response.body).toEqual({
                status: "error",
                message: "Invalid User Agent",
            });
            let channelSpy;
            switch (mockMessageData.channel) {
                case ChannelProviderType.EMAIL:
                    channelSpy = jest.spyOn(channelService.email, "send");
                    break;
                case ChannelProviderType.SMS:
                    channelSpy = jest.spyOn(channelService.sms, "send");
                    break;
                case ChannelProviderType.VOICEMAIL:
                    channelSpy = jest.spyOn(channelService.voicemail, "send");
                    break;
            }
            expect(channelSpy).toHaveBeenCalledTimes(0);
            expect(channelSpy).not.toHaveBeenCalled();
        });

        it("should not send reminder when content-type is invalid", async () => {
            jest.spyOn(console, "error").mockImplementation(() => null);

            const mockMessageData = {
                email: mockUser.email,
                channel: mockUser.reminderChannel,
                name: mockUser.name,
                phone: mockUser.phone,
                reminder: {
                    hour: mockReminderList[0].reminderList[0].reminders[0].hour,
                    medication: mockReminderList[0].reminderList[0].reminders[0].medication,
                },
            };
            const mockPubSubMessage: GoogleMessage = {
                message: {
                    attributes: { channel: ChannelProviderType.DEFAULT },
                    data: Buffer.from(JSON.stringify({ messageData: mockMessageData })).toString("base64"),
                    messageId: "123456789",
                    message_id: "123456789",
                    publishTime: "2023-06-17T22:43:51.179Z",
                    publish_time: "2023-06-17T22:43:51.179Z",
                },
                subscription: "projects/fake-project/subscriptions/fake-subscription",
            };
            const response = await request(app.getHttpServer())
                .post("/reminder/send")
                .set("Content-Type", "application/invalid")
                .set("User-Agent", "CloudPubSub-Google")
                .send(JSON.stringify(mockPubSubMessage));
            expect(response.body).toEqual({
                status: "error",
                message: "Invalid Content-Type",
            });
            let channelSpy;
            switch (mockMessageData.channel) {
                case ChannelProviderType.EMAIL:
                    channelSpy = jest.spyOn(channelService.email, "send");
                    break;
                case ChannelProviderType.SMS:
                    channelSpy = jest.spyOn(channelService.sms, "send");
                    break;
                case ChannelProviderType.VOICEMAIL:
                    channelSpy = jest.spyOn(channelService.voicemail, "send");
                    break;
            }
            expect(channelSpy).toHaveBeenCalledTimes(0);
            expect(channelSpy).not.toHaveBeenCalled();
        });

        it("should send reminder when user agent is from Amazon Pub/Sub (SNS)", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);

            const mockMessageData: MessageData = {
                email: mockUser.email,
                channel: mockUser.reminderChannel,
                name: mockUser.name,
                phone: mockUser.phone,
                reminder: {
                    hour: mockReminderList[0].reminderList[0].reminders[0].hour,
                    medication: mockReminderList[0].reminderList[0].reminders[0].medication,
                },
            };
            const mockPubSubMessage: AmazonMessage = {
                Type: "SubscriptionConfirmation",
                SubscribeURL: "https://fake.com/subscribe",
            };

            jest.spyOn(axios, "get").mockResolvedValueOnce(null);

            const response = await request(app.getHttpServer())
                .post("/reminder/send")
                .set("Content-Type", "application/json")
                .set("User-Agent", "Amazon Simple Notification Service Agent")
                .send(JSON.stringify(mockPubSubMessage));
            expect(response.body).toEqual({
                status: "success",
                message: "Subscription Confirmed",
            });
            let channelSpy;
            switch (mockMessageData.channel) {
                case ChannelProviderType.EMAIL:
                    channelSpy = jest.spyOn(channelService.email, "send");
                    break;
                case ChannelProviderType.SMS:
                    channelSpy = jest.spyOn(channelService.sms, "send");
                    break;
                case ChannelProviderType.VOICEMAIL:
                    channelSpy = jest.spyOn(channelService.voicemail, "send");
                    break;
            }
            expect(channelSpy).not.toHaveBeenCalled();
        });
    });

    describe("/reminder/update", () => {
        it("should update reminder when reminder is valid", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);
            await databaseProvider.newReminders(mockReminderList, mockUser.email);

            const response = await request(app.getHttpServer())
                .put("/reminder/update")
                .send([{ ...mockReminderList[0], name: "Test Updated User" }])
                .set("Content-Type", "application/json");
            expect(response.body).toEqual({
                status: "success",
                message: "Reminders of fake@fake.com updated",
            });
            expect(await databaseProvider.getReminders(mockUser.email)).toEqual([{ ...mockReminderList[0], name: "Test Updated User" }]);
        });

        it("should not update reminder when reminder is invalid", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);
            await databaseProvider.newReminders(mockReminderList, mockUser.email);

            const response = await request(app.getHttpServer())
                .put("/reminder/update")
                .send([{ nameError: "Test Error User", uniqueId: "error-unique-id" }])
                .set("Content-Type", "application/json");
            expect(response.body).toEqual({
                statusCode: 400,
                message: [
                    "uniqueId must be a number conforming to the specified constraints",
                    "level must be a number conforming to the specified constraints",
                    "level should not be empty",
                    "key must be a number conforming to the specified constraints",
                    "key should not be empty",
                    "name must be a string",
                    "name should not be empty",
                    "reminderList must be an array",
                ],
                error: "Bad Request",
            });
            expect(await databaseProvider.getReminders(mockUser.email)).toEqual(mockReminderList);
        });
    });

    describe("/reminder/delete", () => {
        it("should delete all reminders when reminder list is empty array", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);
            await databaseProvider.newReminders(mockReminderList, mockUser.email);

            const response = await request(app.getHttpServer()).delete("/reminder/delete").send([]).set("Content-Type", "application/json");
            expect(response.body).toEqual({
                status: "success",
                message: "Reminders of fake@fake.com deleted",
            });
            expect(await databaseProvider.getReminders(mockUser.email)).toEqual(null);
        });

        it("should not dele reminder when reminder list is invalid", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);
            await databaseProvider.newReminders(mockReminderList, mockUser.email);

            const response = await request(app.getHttpServer())
                .delete("/reminder/delete")
                .send([{ nameError: "Test Error User", uniqueId: "error-unique-id" }])
                .set("Content-Type", "application/json");
            expect(response.body).toEqual({
                statusCode: 400,
                message: [
                    "uniqueId must be a number conforming to the specified constraints",
                    "level must be a number conforming to the specified constraints",
                    "level should not be empty",
                    "key must be a number conforming to the specified constraints",
                    "key should not be empty",
                    "name must be a string",
                    "name should not be empty",
                    "reminderList must be an array",
                ],
                error: "Bad Request",
            });
            expect(await databaseProvider.getReminders(mockUser.email)).toEqual(mockReminderList);
        });
    });
});
