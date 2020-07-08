import { Registry } from "./Registry";
import { connect } from "../GameApi/Database/Database";
import { EventManager } from "./EventManager";

export class Client {
	public static TEST = false;
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
		this.ConsoleLogging = clientSettings.consoleLogging ?? false;
		this.registry.DefaultCredits = clientSettings.defaultCredits ?? 0;
		this.registry.MaxRarity = clientSettings.maximumRarity;
		this.registry.MaxTech = clientSettings.maximumTechLevel;

		Client.TEST = clientSettings.testMode ?? false;
	}

	//#region Registry
	private registry: Registry = new Registry();
	public get Registry(): Registry {
		return this.registry;
	}
	public CopyRegistry(): Registry {
		return new Registry(this.registry);
	}

	public static get Reg(): Registry {
		return this.Get().Registry;
	}
	//#endregion registry

	//#region Database
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
	//#endregion Database

	//#region EventManager

	private eventManager: EventManager = new EventManager();
	public static get EventMan(): EventManager {
		return this.Get().eventManager;
	}
	public get EventMan(): EventManager {
		return this.eventManager;
	}
	//#endregion EventManager
}

interface IClientSettings {
	databaseName: string;
	databaseUri: string;
	consoleLogging?: boolean;
	defaultCredits?: number;
	maximumRarity: number;
	maximumTechLevel: number;
	testMode?: boolean;
}
