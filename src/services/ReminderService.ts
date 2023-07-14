import { HttpStatus, Inject } from "@nestjs/common";
import { DatabaseProvider } from "database/DatabaseProvider";
import { Reminder, ReminderBase, ReminderList, ReminderMedication, ReminderUser } from "interfaces/ReminderInterface";
import { Logger } from "utils/Logger";
import { ChannelService, MessageData } from "interfaces/ChannelInterface";
import { PubSubProvider } from "pubsub/PubSubProvider";
import { ChannelProviderType } from "types/ChannelProviderType";
import { CustomException } from "utils/Errors/CustomException";

export class ReminderService {
    constructor(
        @Inject("DATABASE_SERVICE") private readonly databaseService: DatabaseProvider,
        @Inject("CHANNEL_SERVICE") private readonly channelService: ChannelService,
        @Inject("PUBSUB_SERVICE") private readonly pubSubService: PubSubProvider,
    ) {}

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

    async getNames(email: string) {
        const names = await this.databaseService.getNames(email);
        return names;
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
        const actualReminders = await this.databaseService.getReminders(email);
        if (actualReminders === null) {
            throw new CustomException("Reminders not found", HttpStatus.NOT_FOUND);
        }
        await this.databaseService.updateReminders(reminders, email);
        return {
            status: "success",
            code: HttpStatus.ACCEPTED,
            message: `Reminders of ${email} updated`,
        };
    }

    async delete(reminders: ReminderUser[], email: string) {
        if ((await this.get(email)) === null) {
            throw new CustomException("Reminders not found", HttpStatus.NOT_FOUND);
        } else {
            if (reminders.length !== 0) {
                await this.update(reminders, email);
            } else {
                await this.databaseService.deleteReminders(reminders, email);
            }
        }

        return {
            status: "success",
            code: HttpStatus.OK,
            message: `Reminders of ${email} deleted`,
        };
    }

    async schedule() {
        const { dayWeek, actualHour } = this.getDateHourUTCMinus3();
        const remindersToSchedule = [];
        (await this.databaseService.getAllReminders()).forEach((item: Reminder) => {
            (item.reminders as ReminderUser[]).forEach((reminderUser: ReminderUser) => {
                reminderUser.reminderList.forEach((reminderList: ReminderList) => {
                    if (dayWeek === reminderList.dayOfWeek) {
                        const reminderMedication: ReminderMedication[] = [];
                        reminderList.reminders.forEach((reminder: ReminderMedication) => {
                            if (reminder.hour === actualHour) {
                                reminderMedication.push(reminder);
                                remindersToSchedule.push({
                                    email: item.email,
                                    name: reminderUser.name,
                                    reminders: reminderMedication,
                                });
                            }
                        });
                    }
                });
            });
        });

        if (remindersToSchedule.length === 0) {
            return {
                status: "success",
                code: HttpStatus.OK,
                message: `No reminders to schedule`,
            };
        }

        for (const reminder of remindersToSchedule) {
            const user = await this.databaseService.findUserByEmail(reminder.email);
            reminder.phone = user.phone;
            reminder.channel = user.reminderChannel;
        }
        Logger.log("Scheduling reminders for Pub/Sub Provider", { remindersToSchedule, this: this });

        try {
            const messagesToPublish: MessageData[] = remindersToSchedule.map(item => {
                return item.reminders.map((reminder: ReminderMedication) => {
                    return {
                        name: item.name,
                        phone: item.phone,
                        email: item.email,
                        channel: item.channel,
                        reminder: {
                            medication: reminder.medication,
                            hour: reminder.hour,
                        } as ReminderMedication,
                    };
                })[0];
            });

            for (const message of messagesToPublish) {
                await this.pubSubService.publish(message, message.channel.toLowerCase());
            }

            return {
                status: "success",
                code: HttpStatus.CREATED,
                message: `Reminders scheduled`,
            };
        } catch (error) {
            Logger.error(error.message, { remindersToSchedule, this: this });
            return {
                status: "error",
                code: error.status || 500,
                message: error.response || "Internal Server Error",
            };
        }
    }

    async send(channel: string, messageData: MessageData) {
        try {
            switch (channel.toUpperCase()) {
                case ChannelProviderType.EMAIL:
                    Logger.log("Sending message to email provider", { channel, messageData, this: this });
                    await this.channelService.email.send(messageData);
                    break;
                case ChannelProviderType.SMS:
                    Logger.log("Sending message to sms provider", { channel, messageData, this: this });
                    await this.channelService.sms.send(messageData);
                    break;
                case ChannelProviderType.VOICEMAIL:
                    Logger.log("Sending message to voicemail provider", { channel, messageData, this: this });
                    await this.channelService.voicemail.send(messageData);
                    break;
                default:
                    throw new CustomException("Invalid channel", HttpStatus.NOT_ACCEPTABLE);
            }
            return {
                status: "success",
                code: HttpStatus.OK,
                message: `Message Dispatched`,
            };
        } catch (error) {
            Logger.error(error.message, { channel, messageData, this: this });
            return {
                status: "error",
                code: error.status || 500,
                message: error.response || "Internal Server Error",
            };
        }
    }
}
