import { Test } from "@nestjs/testing";
import { DatabaseProvider } from "../../src/database/DatabaseProvider";
import { ReminderService } from "services/ReminderService";
import { ReminderBase, ReminderUser } from "interfaces/ReminderInterface";
import { HttpStatusCode } from "axios";
import { DatabaseModuleFake } from "../fake/database/DatabaseModuleFake";
import { PubSubProvider } from "pubsub/PubSubProvider";
import { User } from "interfaces/UserInterface";
import { ChannelProviderType } from "types/ChannelProviderType";
import { ChannelService, MessageData } from "interfaces/ChannelInterface";

describe("ReminderService (integration)", () => {
    let reminderService: ReminderService;
    let databaseProvider: DatabaseProvider;
    let pubSubProvider: PubSubProvider;
    let channelService: ChannelService;

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

    async function createData() {
        jest.spyOn(console, "log").mockImplementation(() => null);
        await databaseProvider.newReminders(mockReminderList, "fake@fake.com");
        await databaseProvider.registerUser(mockUser);
    }

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [DatabaseModuleFake],
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
        }).compile();

        reminderService = moduleRef.get<ReminderService>(ReminderService);
        databaseProvider = moduleRef.get<DatabaseProvider>("DATABASE_SERVICE");
        pubSubProvider = moduleRef.get<PubSubProvider>("PUBSUB_SERVICE");
        channelService = moduleRef.get<ChannelService>("CHANNEL_SERVICE");
        await createData();
    });

    afterAll(async () => {
        await databaseProvider.destroy();
    });

    describe("get", () => {
        it("should get reminder list when passing an user email", async () => {
            await createData();
            const spyGetReminders = jest.spyOn(databaseProvider, "getReminders");
            const result = await reminderService.get("fake@fake.com");

            expect(spyGetReminders).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockReminderList);
        });

        it("should not get reminder list when passing an  unexistent user email", async () => {
            await createData();
            const spyGetReminders = jest.spyOn(databaseProvider, "getReminders");
            const result = await reminderService.get("fake-not-exist@fake.com");

            expect(spyGetReminders).toHaveBeenCalledTimes(1);
            expect(result).toEqual(null);
        });
    });

    describe("getNames", () => {
        it("should get names of reminders when passing an user email", async () => {
            const spyGetNames = jest.spyOn(databaseProvider, "getNames");
            const mockNames: string[] = ["Test User"];
            const result = await reminderService.getNames("fake@fake.com");
            expect(spyGetNames).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockNames);
        });

        it("should not get names of reminders when passing an unexistent user email", async () => {
            const spyGetNames = jest.spyOn(databaseProvider, "getNames");
            const result = await reminderService.getNames("fake-not-exist@fake.com");
            expect(spyGetNames).toHaveBeenCalledTimes(1);
            expect(result).toEqual([]);
        });
    });

    describe("new", () => {
        it("should create a new reminder when passing a new email", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);
            const formData: ReminderBase = {
                fullName: "Test User2",
                medicationName: "Existing Medication",
                hour: "09:00",
                daysOfWeek: ["Segunda-feira", "Quarta-feira", "Sexta-feira"],
            };
            expect(await reminderService.new(formData, "fake2@fake.com")).toEqual(
                expect.objectContaining({
                    status: "success",
                    message: "Reminders of fake2@fake.com created",
                    code: HttpStatusCode.Created,
                }),
            );
            expect(await reminderService.get("fake2@fake.com")).toEqual(
                expect.objectContaining([
                    expect.objectContaining({
                        name: "Test User2",
                        reminderList: [
                            expect.objectContaining({
                                dayOfWeek: "Segunda-feira",
                                reminders: [
                                    expect.objectContaining({
                                        medication: "Existing Medication",
                                        hour: "09:00",
                                    }),
                                ],
                            }),
                            expect.objectContaining({
                                dayOfWeek: "Quarta-feira",
                                reminders: [
                                    expect.objectContaining({
                                        medication: "Existing Medication",
                                        hour: "09:00",
                                    }),
                                ],
                            }),
                            expect.objectContaining({
                                dayOfWeek: "Sexta-feira",
                                reminders: [
                                    expect.objectContaining({
                                        medication: "Existing Medication",
                                        hour: "09:00",
                                    }),
                                ],
                            }),
                        ],
                    }),
                ]),
            );
        });

        it("should update a new reminder when passing a existing email that already has a registered reminder", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);
            const formData = {
                fullName: "Test User2",
                medicationName: "Existing Medication",
                hour: "09:00",
                daysOfWeek: ["Segunda-feira", "Quarta-feira", "Sexta-feira"],
            };
            expect(await reminderService.new(formData, "fake@fake.com")).toEqual({
                status: "success",
                message: "Reminders of fake@fake.com updated",
                code: HttpStatusCode.Accepted,
            });
            expect((await reminderService.get("fake@fake.com"))[1]).toEqual(
                expect.objectContaining({
                    name: "Test User2",
                    reminderList: [
                        expect.objectContaining({
                            dayOfWeek: "Segunda-feira",
                            reminders: [
                                expect.objectContaining({
                                    medication: "Existing Medication",
                                    hour: "09:00",
                                }),
                            ],
                        }),
                        expect.objectContaining({
                            dayOfWeek: "Quarta-feira",
                            reminders: [
                                expect.objectContaining({
                                    medication: "Existing Medication",
                                    hour: "09:00",
                                }),
                            ],
                        }),
                        expect.objectContaining({
                            dayOfWeek: "Sexta-feira",
                            reminders: [
                                expect.objectContaining({
                                    medication: "Existing Medication",
                                    hour: "09:00",
                                }),
                            ],
                        }),
                    ],
                }),
            );
        });

        it("should update a existing reminder when passing an existing email to 'new' function", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);
            const formData: ReminderBase = {
                fullName: "Test User",
                medicationName: "Existing Medication",
                hour: "09:00",
                daysOfWeek: ["Segunda-feira", "Quarta-feira", "Sexta-feira"],
            };

            expect(await reminderService.new(formData, "fake@fake.com")).toEqual(
                expect.objectContaining({
                    status: "success",
                    message: "Reminders of fake@fake.com updated",
                    code: HttpStatusCode.Accepted,
                }),
            );
            expect(await reminderService.get("fake@fake.com")).toEqual(
                expect.objectContaining([
                    expect.objectContaining({
                        name: "Test User",
                        reminderList: [
                            expect.objectContaining({
                                dayOfWeek: "Terça-feira",
                                reminders: [
                                    expect.objectContaining({
                                        medication: "Existing Medication",
                                        hour: "09:00",
                                    }),
                                ],
                            }),
                            expect.objectContaining({
                                dayOfWeek: "Segunda-feira",
                                reminders: [
                                    expect.objectContaining({
                                        medication: "Existing Medication",
                                        hour: "09:00",
                                    }),
                                ],
                            }),
                            expect.objectContaining({
                                dayOfWeek: "Quarta-feira",
                                reminders: [
                                    expect.objectContaining({
                                        medication: "Existing Medication",
                                        hour: "09:00",
                                    }),
                                ],
                            }),
                            expect.objectContaining({
                                dayOfWeek: "Sexta-feira",
                                reminders: [
                                    expect.objectContaining({
                                        medication: "Existing Medication",
                                        hour: "09:00",
                                    }),
                                ],
                            }),
                        ],
                    }),
                ]),
            );
        });
    });

    describe("update", () => {
        it("should update a existing reminder when passing an existing email", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);

            mockReminderList.push({
                uniqueId: 1234567890,
                key: 2,
                level: 0,
                name: "Test New User",
                reminderList: [
                    {
                        uniqueId: 12345678900,
                        key: 1,
                        level: 1,
                        dayOfWeek: "Quarta-feira",
                        reminders: [
                            {
                                level: 2,
                                key: 2,
                                uniqueId: 12345678900,
                                medication: "Existing New Medication",
                                hour: "09:00",
                            },
                        ],
                    },
                ],
            });

            expect(await reminderService.update(mockReminderList, "fake@fake.com")).toEqual(
                expect.objectContaining({
                    status: "success",
                    message: "Reminders of fake@fake.com updated",
                    code: HttpStatusCode.Accepted,
                }),
            );
            expect(await reminderService.get("fake@fake.com")).toEqual(
                expect.objectContaining([
                    expect.objectContaining({
                        name: "Test User",
                        reminderList: [
                            expect.objectContaining({
                                dayOfWeek: "Terça-feira",
                                reminders: [
                                    expect.objectContaining({
                                        medication: "Existing Medication",
                                        hour: "09:00",
                                    }),
                                ],
                            }),
                        ],
                    }),
                    expect.objectContaining({
                        name: "Test New User",
                        reminderList: [
                            expect.objectContaining({
                                dayOfWeek: "Quarta-feira",
                                reminders: [
                                    expect.objectContaining({
                                        medication: "Existing New Medication",
                                        hour: "09:00",
                                    }),
                                ],
                            }),
                        ],
                    }),
                ]),
            );
        });

        it("should not create a reminder and throw error when passing an not existing email using update method", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);

            expect(reminderService.update(mockReminderList, "fake-not-exist@fake.com")).rejects.toThrowError("Reminders not found");
            expect(await reminderService.get("fake-not-exist@fake.com")).toEqual(null);
        });
    });

    describe("delete", () => {
        it("should delete a reminder when passing an existing email and reminderList", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);
            expect(await reminderService.delete(mockReminderList, "fake@fake.com")).toEqual(
                expect.objectContaining({
                    status: "success",
                    message: "Reminders of fake@fake.com deleted",
                    code: HttpStatusCode.Ok,
                }),
            );
            expect(await reminderService.get("fake@fake.com")).toEqual(expect.objectContaining([] || null));
        });

        it("should not delete a reminder and throw error when passing an invalid email", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);
            expect(reminderService.delete(mockReminderList, "fake-not-exist@fake.com")).rejects.toThrowError("Reminders not found");
        });

        it("should not delete a reminder and throw error when passing an invalid email and reminder list with no reminders", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);
            expect(reminderService.delete([{ ...mockReminderList[0], reminderList: [] }], "fake-not-exist@fake.com")).rejects.toThrowError("Reminders not found");
        });
    });

    describe("schedule", () => {
        it("should schedule a reminder when have reminders to send in actual hour", async () => {
            const fixedDate = new Date("2023-07-04T12:00:00Z");
            jest.useFakeTimers().setSystemTime(fixedDate);
            jest.spyOn(console, "log").mockImplementation(() => null);
            const pubSubSpy = jest.spyOn(pubSubProvider, "publish");

            expect(await reminderService.schedule()).toEqual(
                expect.objectContaining({
                    status: "success",
                    message: "Reminders scheduled",
                    code: HttpStatusCode.Created,
                }),
            );

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

            expect(pubSubSpy).toHaveBeenCalledTimes(1);
            expect(pubSubSpy).toHaveBeenCalledWith(mockMessageData, mockUser.reminderChannel.toLowerCase());
        });

        it("should not schedule a reminder when don't have reminders to send in actual hour", async () => {
            const fixedDate = new Date("2023-07-04T13:00:00Z");
            jest.useFakeTimers().setSystemTime(fixedDate);
            jest.spyOn(console, "log").mockImplementation(() => null);
            const pubSubSpy = jest.spyOn(pubSubProvider, "publish");

            expect(await reminderService.schedule()).toEqual(
                expect.objectContaining({
                    status: "success",
                    message: "No reminders to schedule",
                    code: HttpStatusCode.Ok,
                }),
            );

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

            expect(pubSubSpy).toHaveBeenCalledTimes(0);
            expect(pubSubSpy).not.toHaveBeenCalledWith(mockMessageData, mockUser.reminderChannel.toLowerCase());
        });
    });

    describe("send", () => {
        it("should reminder user using provied channel", async () => {
            jest.spyOn(console, "log").mockImplementation(() => null);

            const emailChannelSpy = jest.spyOn(channelService.email, "send");
            const smsChannelSpy = jest.spyOn(channelService.sms, "send");
            const voicemailChannelSpy = jest.spyOn(channelService.voicemail, "send");

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
            expect(await reminderService.send("sms", mockMessageData)).toEqual(
                expect.objectContaining({
                    status: "success",
                    message: "Message Dispatched",
                    code: HttpStatusCode.Ok,
                }),
            );
            expect(smsChannelSpy).toHaveBeenCalledTimes(1);

            expect(await reminderService.send("email", mockMessageData)).toEqual(
                expect.objectContaining({
                    status: "success",
                    message: "Message Dispatched",
                    code: HttpStatusCode.Ok,
                }),
            );
            expect(emailChannelSpy).toHaveBeenCalledTimes(1);

            expect(await reminderService.send("voicemail", mockMessageData)).toEqual(
                expect.objectContaining({
                    status: "success",
                    message: "Message Dispatched",
                    code: HttpStatusCode.Ok,
                }),
            );
            expect(voicemailChannelSpy).toHaveBeenCalledTimes(1);
        });

        it("should not reminder user when invalid provied channel", async () => {
            jest.spyOn(console, "error").mockImplementation(() => null);

            const emailChannelSpy = jest.spyOn(channelService.email, "send");
            const smsChannelSpy = jest.spyOn(channelService.sms, "send");
            const voicemailChannelSpy = jest.spyOn(channelService.voicemail, "send");

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
            expect(await reminderService.send("not-exist", mockMessageData)).toEqual(
                expect.objectContaining({
                    status: "error",
                    message: "Invalid channel",
                    code: HttpStatusCode.NotAcceptable,
                }),
            );
            expect(smsChannelSpy).toHaveBeenCalledTimes(0);
            expect(emailChannelSpy).toHaveBeenCalledTimes(0);
            expect(voicemailChannelSpy).toHaveBeenCalledTimes(0);
        });
    });
});
