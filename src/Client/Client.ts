import { Registry } from "./Registry.ts";

export class Client {
	//Client Singleton Generation
	public static Client: Client;
	public static GetClient() {
		if (this.Client == null) {
			throw new Error("You must explicity create the client. Did you forget to go Client.CreateClient(IClientSettings)?");
		}
		return this.Client;
	}
	public static CreateClient(ClientSettings: IClientSettings) {
		this.Client = new Client(ClientSettings);
	}
	private constructor(ClientSettings: IClientSettings) {}

	//Client Instance
	private registry: Registry = new Registry();
	public get Registry(): Registry {
		return this.registry;
	}
}

interface IClientSettings {}
