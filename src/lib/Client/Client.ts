import { Registry } from "./Registry.ts";

export class Client {
	//Section: Client Singleton
	public static Client: Client;
	public static Get() {
		if (this.Client == null) {
			throw new Error("You must explicity create the client. Did you forget to go Client.CreateClient(IClientSettings)?");
		}
		return this.Client;
	}
	public static Create(ClientSettings: IClientSettings) {
		if (this.Client) throw new Error("A client has already been made. Please use Client.Get() to access it.");
		this.Client = new Client(ClientSettings);
	}
	public static Destroy() {
		delete this.Client;
	}
	private constructor(ClientSettings: IClientSettings) {}

	//Section: Registry
	private registry: Registry = new Registry();
	public get Registry(): Registry {
		return this.registry;
	}
	public CopyRegistry(): Registry {
		return new Registry(this.registry);
	}
}

interface IClientSettings {}
