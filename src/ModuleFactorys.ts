import { ChannelProvider } from "./channels/ChannelProvider";
import { DatabaseProvider } from "./database/DatabaseProvider";
import { ChannelProviderMap, ChannelProviderType, EmailChannelProviderType, SmsChannelProviderType, VoiceMailChannelProviderType } from "./types/ChannelProviderType";
import { DatabaseProviderMap, DatabaseProviderType } from "./types/DatabaseProviderType";
import { Logger } from "./utils/Logger";

export function databaseFactory(
    databaseProvider: DatabaseProviderType,
    mongoDbUri: string,
    mongoDbDatabaseName: string,
    mysqlHost: string,
    mysqlPort: number,
    mysqlUserName: string,
    mysqlPassword: string,
    mysqlDatabaseName: string,
): DatabaseProvider {
    if (!databaseProvider) {
        Logger.warn(`No database provider setted, using default ${DatabaseProviderType.DEFAULT} provider`, { databaseProvider, this: this });
        databaseProvider = DatabaseProviderType.DEFAULT;
    }
    const provider = DatabaseProviderMap[databaseProvider];
    return new DatabaseProvider(provider.factory([mongoDbUri, mongoDbDatabaseName, mysqlHost, mysqlPort, mysqlUserName, mysqlPassword, mysqlDatabaseName]));
}

export function channelFactory(
    emailProvider: EmailChannelProviderType,
    smsProvider: SmsChannelProviderType,
    voiceMailProvider: VoiceMailChannelProviderType,
    brevoApiKey: string,
    mobizonApiKey: string,
    nvoipSid: string,
    nvoipUserToken: string,
) {
    const provider = {};

    Object.defineProperty(provider, "email", {
        get: () =>
            new ChannelProvider(
                ChannelProviderMap[ChannelProviderType.EMAIL].factory([emailProvider, smsProvider, voiceMailProvider, brevoApiKey, mobizonApiKey, nvoipSid, nvoipUserToken]),
            ),
    });

    Object.defineProperty(provider, "sms", {
        get: () =>
            new ChannelProvider(
                ChannelProviderMap[ChannelProviderType.SMS].factory([emailProvider, smsProvider, voiceMailProvider, brevoApiKey, mobizonApiKey, nvoipSid, nvoipUserToken]),
            ),
    });

    Object.defineProperty(provider, "voicemail", {
        get: () =>
            new ChannelProvider(
                ChannelProviderMap[ChannelProviderType.VOICEMAIL].factory([emailProvider, smsProvider, voiceMailProvider, brevoApiKey, mobizonApiKey, nvoipSid, nvoipUserToken]),
            ),
    });

    return provider;
}
