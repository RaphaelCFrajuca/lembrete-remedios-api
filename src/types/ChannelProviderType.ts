import { BrevoService } from "src/channels/providers/email/BrevoService";
import { MobizonService } from "src/channels/providers/sms/MobizonService";
import { NvoipService } from "src/channels/providers/voicemail/NvoipService";

export enum ChannelProviderType {
    EMAIL = "EMAIL",
    SMS = "SMS",
    VOICEMAIL = "VOICEMAIL",
    DEFAULT = SMS,
}

export enum EmailChannelProviderType {
    BREVO = "BREVO",
    DEFAULT = BREVO,
}

export enum SmsChannelProviderType {
    MOBIZON = "MOBIZON",
    DEFAULT = MOBIZON,
}

export enum VoiceMailChannelProviderType {
    NVOIP = "NVOIP",
    DEFAULT = NVOIP,
}

export const ChannelProviderMap = {
    [ChannelProviderType.EMAIL]: {
        service: [BrevoService],
        factory: (args: any[], emailProvider?: string) => {
            if (!emailProvider) {
                emailProvider = EmailChannelProviderType.DEFAULT;
            }

            if (emailProvider === EmailChannelProviderType.BREVO) {
                return new BrevoService(args[0]);
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
                return new MobizonService(args[1]);
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
                return new NvoipService(args[2], args[3]);
            }
        },
    },
};
