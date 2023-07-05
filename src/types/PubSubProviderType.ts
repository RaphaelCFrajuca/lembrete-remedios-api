import { AmazonPubSubService } from "pubsub/providers/amazon/AmazonPubSubService";
import { GooglePubSubService } from "pubsub/providers/google/GooglePubSubService";

export enum PubSubProviderType {
    GOOGLE = "GOOGLE",
    AMAZON = "AMAZON",
    DEFAULT = GOOGLE,
}

export interface PubSubCredentials {
    google?: undefined;
    amazon?: {
        region: string;
        accessKeyId: string;
        secretAccessKey: string;
    };
}

export const PubSubProviderMap = {
    [PubSubProviderType.GOOGLE]: {
        service: GooglePubSubService,
        factory: (args: any[]): GooglePubSubService => new GooglePubSubService(args[0]),
    },
    [PubSubProviderType.AMAZON]: {
        service: AmazonPubSubService,
        factory: (args: any[]): AmazonPubSubService => new AmazonPubSubService(args[0], args[1]),
    },
};
