import { HttpStatus, Inject } from "@nestjs/common";
import { DatabaseProvider } from "src/database/DatabaseProvider";
import { ReminderBase, ReminderList, ReminderMedication, ReminderUser } from "src/interfaces/ReminderInterface";

export class ReminderService {
    constructor(@Inject("DATABASE_SERVICE") private readonly databaseService: DatabaseProvider) {}

    updateRemindersObject(formData: ReminderBase, actualData: ReminderUser[]): ReminderUser[] {
        const existingDataIndex = actualData.findIndex(data => data.name === formData.fullName);

        if (existingDataIndex !== -1) {
            const existingData = actualData[existingDataIndex];

            formData.daysOfWeek.forEach(dayOfWeek => {
                const existingDayIndex = existingData.reminderList.findIndex(reminder => reminder.dayOfWeek === dayOfWeek);

                if (existingDayIndex !== -1) {
                    const existingDay = existingData.reminderList[existingDayIndex];
                    existingDay.reminders.push({
                        level: 2,
                        key: existingDay.reminders.length + 1,
                        uniqueId: Number(
                            Math.floor(Math.random() * 1e10)
                                .toString()
                                .padStart(10, "0"),
                        ),
                        medication: formData.medicationName,
                        hour: formData.hour,
                    });
                } else {
                    existingData.reminderList.push({
                        level: 1,
                        key: existingData.reminderList.length + 1,
                        uniqueId: Number(
                            Math.floor(Math.random() * 1e10)
                                .toString()
                                .padStart(10, "0"),
                        ),
                        dayOfWeek: dayOfWeek,
                        reminders: [
                            {
                                level: 2,
                                key: 1,
                                uniqueId: Number(
                                    Math.floor(Math.random() * 1e10)
                                        .toString()
                                        .padStart(10, "0"),
                                ),
                                medication: formData.medicationName,
                                hour: formData.hour,
                            },
                        ],
                    });
                }
            });
        } else {
            const newUniqueId = Number(
                Math.floor(Math.random() * 1e10)
                    .toString()
                    .padStart(10, "0"),
            );

            const newData = {
                level: 0,
                key: actualData.length + 1,
                uniqueId: newUniqueId,
                name: formData.fullName,
                reminderList: formData.daysOfWeek.map((dayOfWeek, index) => {
                    return {
                        level: 1,
                        key: index + 1,
                        uniqueId: Number(
                            Math.floor(Math.random() * 1e10)
                                .toString()
                                .padStart(10, "0"),
                        ),
                        dayOfWeek: dayOfWeek,
                        reminders: [
                            {
                                level: 2,
                                key: 1,
                                uniqueId: Number(
                                    Math.floor(Math.random() * 1e10)
                                        .toString()
                                        .padStart(10, "0"),
                                ),
                                medication: formData.medicationName,
                                hour: formData.hour,
                            },
                        ],
                    };
                }),
            };

            actualData.push(newData);
        }

        return actualData;
    }

    generateNewReminderUser(data: ReminderBase) {
        const { fullName, medicationName, daysOfWeek, hour } = data;
        let keyCounter0 = 1;

        const reminderList: ReminderList[] = daysOfWeek.map((dayOfWeek: string) => {
            let keyCounter1 = 1;
            let keyCounter2 = 1;
            const reminders: ReminderMedication[] = [
                {
                    uniqueId: Number(
                        Math.floor(Math.random() * 1e10)
                            .toString()
                            .padStart(10, "0"),
                    ),
                    level: 1,
                    key: keyCounter1++,
                    medication: medicationName,
                    hour,
                },
            ];
            return {
                uniqueId: Number(
                    Math.floor(Math.random() * 1e10)
                        .toString()
                        .padStart(10, "0"),
                ),
                level: 1,
                key: keyCounter2++,
                dayOfWeek: dayOfWeek,
                reminders,
            };
        });

        return {
            uniqueId: Number(
                Math.floor(Math.random() * 1e10)
                    .toString()
                    .padStart(10, "0"),
            ),
            level: 0,
            key: keyCounter0++,
            name: fullName,
            reminderList: reminderList,
        };
    }

    async get(email: string) {
        return await this.databaseService.getReminders(email);
    }

    async new(body: ReminderBase, email: string) {
        const actualReminders = await this.databaseService.getReminders(email);
        if (actualReminders === null) {
            const newReminders = this.updateRemindersObject(body, []);
            await this.databaseService.newReminders(newReminders, email);
            return {
                status: "success",
                code: HttpStatus.CREATED,
                message: `Reminders of ${email} created`,
            };
        } else {
            const newReminders = this.updateRemindersObject(body, actualReminders);
            await this.update(newReminders, email);
            return {
                status: "success",
                code: HttpStatus.ACCEPTED,
                message: `Reminders of ${email} updated`,
            };
        }
    }

    async update(reminders: ReminderUser[], email: string) {
        await this.databaseService.updateReminders(reminders, email);
        return {
            status: "success",
            code: HttpStatus.ACCEPTED,
            message: `Reminders of ${email} updated`,
        };
    }

    async delete(reminders: ReminderUser[], email: string) {
        if (reminders.length !== 0) {
            await this.update(reminders, email);
        } else {
            await this.databaseService.deleteReminders(reminders, email);
        }

        return {
            status: "success",
            code: HttpStatus.OK,
            message: `Reminders of ${email} deleted`,
        };
    }
}
