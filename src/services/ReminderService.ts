import { HttpStatus, Inject } from "@nestjs/common";
import { DatabaseProvider } from "src/database/DatabaseProvider";
import { Reminder, ReminderBase, ReminderList, ReminderMedication, ReminderToSchedule, ReminderUser } from "src/interfaces/ReminderInterface";
import { Logger } from "src/utils/Logger";
import { ChannelService, MessageData } from "src/interfaces/ChannelInterface";

export class ReminderService {
    constructor(@Inject("DATABASE_SERVICE") private readonly databaseService: DatabaseProvider, @Inject("CHANNEL_SERVICE") private readonly channelService: ChannelService) {}

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

    getDateHourUTCMinus3() {
        const now = new Date();

        const formatterDate = new Intl.DateTimeFormat("pt-BR", {
            timeZone: "America/Sao_Paulo",
            weekday: "long",
        });

        const formatterHour = new Intl.DateTimeFormat("pt-BR", {
            timeZone: "America/Sao_Paulo",
            hour: "numeric",
            minute: "numeric",
        });

        let dayWeek = formatterDate.format(now);
        dayWeek = dayWeek.charAt(0).toUpperCase() + dayWeek.slice(1);
        const actualHour = formatterHour.format(now);

        return {
            dayWeek,
            actualHour,
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

    async schedule() {
        const { dayWeek, actualHour } = { actualHour: "03:00", dayWeek: "Sexta-feira" };
        //const { dayWeek, actualHour } = this.getDateHourUTCMinus3();
        const remindersToSchedule = [];
        (await this.databaseService.getAllReminders()).map((item: Reminder) => {
            return (item.reminders as ReminderUser[]).map((reminderUser: ReminderUser) => {
                return reminderUser.reminderList.map((reminderList: ReminderList) => {
                    if (dayWeek === reminderList.dayOfWeek) {
                        const reminderMedication: ReminderMedication[] = [];
                        return reminderList.reminders.map((reminder: ReminderMedication) => {
                            if (reminder.hour === actualHour) {
                                reminderMedication.push(reminder);
                                remindersToSchedule.push({
                                    email: item.email,
                                    name: reminderUser.name,
                                    reminders: reminderMedication,
                                });
                                return {
                                    email: item.email,
                                    name: reminderUser.name,
                                    reminders: reminderMedication,
                                };
                            }
                        })[0] as ReminderToSchedule;
                    }
                })[0];
            })[0];
        });
        for (const reminder of remindersToSchedule) {
            reminder.phone = (await this.databaseService.findUserByEmail(reminder.email)).phone;
        }
        Logger.log("Scheduling reminders for Pub/Sub Provider", { remindersToSchedule, this: this });

        try {
            const messagesToPublish: MessageData[] = remindersToSchedule.map(item => {
                return item.reminders.map(reminder => {
                    return {
                        name: item.name,
                        phone: item.phone,
                        email: item.email,
                        reminder: {
                            medication: reminder.medication,
                            hour: reminder.hour,
                        },
                    };
                })[0];
            });
            await this.channelService.voicemail.send(messagesToPublish[0]);
            return {
                status: "success",
                code: HttpStatus.CREATED,
                message: `Reminders scheduled`,
            };
        } catch (error) {
            Logger.error(error.response, { remindersToSchedule, this: this });
            return {
                status: "error",
                code: error.status,
                message: error.response,
            };
        }
    }
}