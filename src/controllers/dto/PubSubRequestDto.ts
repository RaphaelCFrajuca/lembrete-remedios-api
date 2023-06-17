import { IsNotEmpty, IsNotEmptyObject, IsObject, IsString } from "class-validator";

export class PubSubRequestDto {
    @IsNotEmptyObject()
    @IsObject()
    message: {
        attributes: {
            channel: string;
        };
        data: string;
        messageId: string;
        message_id: string;
        publishTime: string;
        publish_time: string;
    };
    @IsNotEmpty()
    @IsString()
    subscription: string;
}
