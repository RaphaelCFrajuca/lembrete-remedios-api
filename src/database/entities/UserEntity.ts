import { User } from "src/interfaces/UserInterface";
import { ChannelProviderType } from "src/types/ChannelProviderType";
import { Entity, Column, PrimaryColumn, ObjectIdColumn, ObjectId } from "typeorm";

@Entity("users")
export class UserEntity implements User {
    @Column()
    nickname: string;

    @Column()
    name: string;

    @Column()
    reminderChannel: ChannelProviderType;

    @Column()
    given_name: string;

    @Column()
    family_name: string;

    @Column()
    locale: string;

    @Column()
    picture: string;

    @PrimaryColumn({ unique: true })
    email: string;

    @Column({ unique: true })
    phone: string;

    @Column()
    email_verified: boolean;
}

// Mongo não funcionou sem a coluna _id
@Entity("users")
export class UserEntityMongo extends UserEntity {
    @ObjectIdColumn()
    _id?: ObjectId;
}
