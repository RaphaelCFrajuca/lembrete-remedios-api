import { Entity, Column, PrimaryColumn, ObjectIdColumn, ObjectId } from "typeorm";

@Entity("users")
export class UserEntity {
    @Column()
    nickname: string;

    @Column()
    name: string;

    @Column()
    picture: string;

    @PrimaryColumn({ unique: true })
    email: string;

    @Column()
    email_verified: boolean;
}

// Mongo não funcionou sem a coluna _id
@Entity("users")
export class UserEntityMongo extends UserEntity {
    @ObjectIdColumn()
    _id?: ObjectId;
}
