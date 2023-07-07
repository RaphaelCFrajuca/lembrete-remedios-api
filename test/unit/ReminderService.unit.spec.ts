import { Test } from "@nestjs/testing";
import { ReminderService } from "services/ReminderService";
import { ReminderBase, ReminderUser } from "interfaces/ReminderInterface";

describe("ReminderService (unit)", () => {
    let reminderService: ReminderService;
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

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                ReminderService,
                {
                    provide: "DATABASE_SERVICE",
                    useValue: jest.fn(),
                },
                {
                    provide: "CHANNEL_SERVICE",
                    useValue: {
                        sendNotification: jest.fn(),
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
    });

    it("should update the reminders object correctly", () => {
        const formData: ReminderBase = {
            fullName: "Test User",
            medicationName: "Existing Medication",
            hour: "09:00",
            daysOfWeek: ["Segunda-feira", "Quarta-feira", "Sexta-feira"],
        };
        const expectedData = [
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
                    {
                        level: 1,
                        key: 2,
                        uniqueId: expect.any(Number),
                        dayOfWeek: "Segunda-feira",
                        reminders: [
                            {
                                level: 2,
                                key: 1,
                                uniqueId: expect.any(Number),
                                medication: "Existing Medication",
                                hour: "09:00",
                            },
                        ],
                    },
                    {
                        level: 1,
                        key: 3,
                        uniqueId: expect.any(Number),
                        dayOfWeek: "Quarta-feira",
                        reminders: [
                            {
                                level: 2,
                                key: 1,
                                uniqueId: expect.any(Number),
                                medication: "Existing Medication",
                                hour: "09:00",
                            },
                        ],
                    },
                    {
                        level: 1,
                        key: 4,
                        uniqueId: expect.any(Number),
                        dayOfWeek: "Sexta-feira",
                        reminders: [
                            {
                                level: 2,
                                key: 1,
                                uniqueId: expect.any(Number),
                                medication: "Existing Medication",
                                hour: "09:00",
                            },
                        ],
                    },
                ],
            },
        ];

        const result: ReminderUser[] = reminderService.updateRemindersObject(formData, mockReminderList);

        expect(result).toEqual(expectedData);
    });

    it("should return the correct day of the week and hour", () => {
        const fixedDate = new Date("2022-01-01T12:00:00Z");
        jest.useFakeTimers().setSystemTime(fixedDate);

        const expectedDayOfWeek = "Sábado";
        const expectedHour = "09:00";

        const result = reminderService.getDateHourUTCMinus3();

        expect(result.dayWeek).toBe(expectedDayOfWeek);
        expect(result.actualHour).toMatch(expectedHour);
    });
});
