import { ChannelProvider } from "./channels/ChannelProvider";
import { DatabaseProvider } from "./database/DatabaseProvider";
import { PubSubProvider } from "./pubsub/PubSubProvider";
import { ChannelProviderMap, ChannelProviderType, EmailChannelProviderType, SmsChannelProviderType, VoiceMailChannelProviderType } from "./types/ChannelProviderType";
import { DatabaseProviderMap, DatabaseProviderType } from "./types/DatabaseProviderType";
import { PubSubProviderMap, PubSubProviderType } from "./types/PubSubProviderType";
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

export function pubSubFactory(pubSubProvider: string, topicName: string): PubSubProvider {
    if (!pubSubProvider) {
        Logger.warn(`No Pub/Sub provider setted, using default ${PubSubProviderType.DEFAULT} provider`, { pubSubProvider, this: this });
        pubSubProvider = PubSubProviderType.DEFAULT;
    }

    if (!topicName) {
        throw new Error("Pub/Sub topic name not provided");
    }
    const provider = PubSubProviderMap[pubSubProvider];
    return new PubSubProvider(provider.factory([topicName]));
}

export function channelFactory(
    emailProvider: EmailChannelProviderType,
    smsProvider: SmsChannelProviderType,
    voiceMailProvider: VoiceMailChannelProviderType,
    brevoApiKey: string,
    brevoApiUrl: string,
    mobizonApiKey: string,
    mobizonApiUrl: string,
    nvoipSid: string,
    nvoipUserToken: string,
    nvoipApiUrl: string,
) {
    const provider = {};

    Object.defineProperty(provider, "email", {
        get: () =>
            new ChannelProvider(
                ChannelProviderMap[ChannelProviderType.EMAIL].factory(
                    [brevoApiKey, brevoApiUrl, mobizonApiKey, mobizonApiUrl, nvoipSid, nvoipUserToken, nvoipApiUrl],
                    emailProvider,
                ),
            ),
    });

    Object.defineProperty(provider, "sms", {
        get: () =>
            new ChannelProvider(
                ChannelProviderMap[ChannelProviderType.SMS].factory([brevoApiKey, brevoApiUrl, mobizonApiKey, mobizonApiUrl, nvoipSid, nvoipUserToken, nvoipApiUrl], smsProvider),
            ),
    });

    Object.defineProperty(provider, "voicemail", {
        get: () =>
            new ChannelProvider(
                ChannelProviderMap[ChannelProviderType.VOICEMAIL].factory(
                    [brevoApiKey, brevoApiUrl, mobizonApiKey, mobizonApiUrl, nvoipSid, nvoipUserToken, nvoipApiUrl],
                    voiceMailProvider,
                ),
            ),
    });

    return provider;
}
