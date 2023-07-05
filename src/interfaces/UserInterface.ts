import { ChannelProviderType } from "types/ChannelProviderType";

export class User {
    nickname: string;
    name: string;
    reminderChannel: ChannelProviderType;
    given_name: string;
    family_name: string;
    locale: string;
    picture: string;
    email: string;
    phone: string;
    email_verified: boolean;
}
