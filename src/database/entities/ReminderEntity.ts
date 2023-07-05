import { Reminder, ReminderUser } from "interfaces/ReminderInterface";
import { Column, Entity, ObjectId, ObjectIdColumn, PrimaryColumn } from "typeorm";

@Entity("reminders")
export class ReminderEntity implements Reminder {
    reminders: string | ReminderUser[];

    @PrimaryColumn({ unique: true })
    email: string;
}

@Entity("reminders")
export class ReminderEntityMySQL extends ReminderEntity {
    @Column()
    reminders: string;
}

@Entity("reminders")
export class ReminderEntityMongo extends ReminderEntity {
    @ObjectIdColumn()
    _id?: ObjectId;

    @Column()
    reminders: ReminderUser[];
}
