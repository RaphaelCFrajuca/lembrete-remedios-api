import { GooglePubSubService } from "src/pubsub/providers/google/GooglePubSubService";

export enum PubSubProviderType {
    GOOGLE = "GOOGLE",
    DEFAULT = GOOGLE,
}

export const PubSubProviderMap = {
    [PubSubProviderType.GOOGLE]: {
        service: GooglePubSubService,
        factory: (args: any[]) => new GooglePubSubService(args[0]),
    },
};
