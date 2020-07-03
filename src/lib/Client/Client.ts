import { Registry } from "./Registry";
import { Ship } from "../GameTypes/GameAsset/Ship/Ship";
import { connect } from "../GameApi/Database/Database";

export class Client {
	//Section: Declared Constants
	public readonly ConsoleLogging: boolean;
	//Section: Client Singleton
	public static Client: Client;
	public static Get() {
		if (this.Client == null) {
			throw new Error("You must explicity create the client. Did you forget to go Client.CreateClient(IClientSettings)?");
		}
		return this.Client;
	}
	public static get Reg(): Registry {
		return this.Get().Registry;
	}

	public static Create(ClientSettings: IClientSettings) {
		if (this.Client) return; //throw new Error("A client has already been made. Please use Client.Get() to access it.");
		this.Client = new Client(ClientSettings);
	}
	public static Destroy() {
		delete this.Client;
	}
	private constructor(clientSettings: IClientSettings) {
		this.uri = clientSettings.databaseUri;
		this.dbName = clientSettings.databaseName;
		this.ConsoleLogging = clientSettings.consoleLogging || false;
		this.registry.DefaultCredits = clientSettings.defaultCredits || 0;
		this.registry.MaxRarity = clientSettings.maximumRarity;
	}

	//Section: Registry
	private registry: Registry = new Registry();
	public get Registry(): Registry {
		return this.registry;
	}
	public CopyRegistry(): Registry {
		return new Registry(this.registry);
	}

	//Section: Database
	private uri: string = "";
	public get Uri() {
		return this.uri;
	}
	private dbName: string = "";
	public get DbName() {
		return this.dbName;
	}
	public Connect(): void {
		connect();
	}
}

interface IClientSettings {
	databaseName: string;
	databaseUri: string;
	consoleLogging?: boolean;
	defaultCredits?: number;
	maximumRarity: number;
}
