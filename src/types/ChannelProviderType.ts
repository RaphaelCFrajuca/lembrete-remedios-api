import { AmazonSESService } from "channels/providers/email/AmazonSESService";
import { BrevoService } from "channels/providers/email/BrevoService";
import { MobizonService } from "channels/providers/sms/MobizonService";
import { NvoipService } from "channels/providers/voicemail/NvoipService";

export enum ChannelProviderType {
    EMAIL = "EMAIL",
    SMS = "SMS",
    VOICEMAIL = "VOICEMAIL",
    DEFAULT = SMS,
}

export enum EmailChannelProviderType {
    BREVO = "BREVO",
    SES = "SES",
    DEFAULT = SES,
}
export enum SmsChannelProviderType {
    MOBIZON = "MOBIZON",
    DEFAULT = MOBIZON,
}
export enum VoiceMailChannelProviderType {
    NVOIP = "NVOIP",
    DEFAULT = NVOIP,
}

export interface AmazonSESCredentials {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
}

export const ChannelProviderMap = {
    [ChannelProviderType.EMAIL]: {
        service: [BrevoService, AmazonSESService],
        factory: (args: any[], emailProvider?: string) => {
            if (!emailProvider) {
                emailProvider = EmailChannelProviderType.DEFAULT;
            }

            if (emailProvider === EmailChannelProviderType.BREVO) {
                return new BrevoService(args[0], args[1]);
            }

            if (emailProvider === EmailChannelProviderType.SES) {
                return new AmazonSESService(args[7].accessKeyId, args[7].secretAccessKey, args[7].region);
            }
        },
    },
    [ChannelProviderType.SMS]: {
        service: [MobizonService],
        factory: (args: any[], smsProvider?: string) => {
            if (!smsProvider) {
                smsProvider = SmsChannelProviderType.DEFAULT;
            }

            if (smsProvider === SmsChannelProviderType.MOBIZON) {
                return new MobizonService(args[2], args[3]);
            }
        },
    },
    [ChannelProviderType.VOICEMAIL]: {
        service: [NvoipService],
        factory: (args: any[], voiceMailProvider?: string) => {
            if (!voiceMailProvider) {
                voiceMailProvider = VoiceMailChannelProviderType.DEFAULT;
            }

            if (voiceMailProvider === VoiceMailChannelProviderType.NVOIP) {
                return new NvoipService(args[4], args[5], args[6]);
            }
        },
    },
};
