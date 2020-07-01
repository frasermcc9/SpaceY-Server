import { IPlayerDocument } from "../../../GameApi/Database/Player/PlayerModel";
import { PlayerInventory, TRegistered } from "./PlayerInventory";
export declare class Player {
    private uId;
    get UId(): string;
    private ship;
    private skin;
    private inventory;
    get Inventory(): PlayerInventory;
    CreditsIncrement({ amount, noImplicitSave }: {
        amount: number;
        noImplicitSave?: boolean;
    }): Promise<boolean>;
    CreditsDecrement({ amount, noImplicitSave }: {
        amount: number;
        noImplicitSave?: boolean;
    }): Promise<boolean>;
    get Credits(): number;
    /**
     * Increases the given item by the amount.
     * @param itemName
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 4-Registry not found
     */
    MaterialIncrement(name: string, quantity: number): Promise<{
        success: boolean;
        amount: number;
        code: 1 | 2 | 3 | 4;
        error?: string;
    }>;
    /**
     * Reduces a given item by the given amount. Cannot reduce below zero.
     * @param itemName
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources, 4-Registry not found
     */
    MaterialDecrement(name: string, quantity: number): Promise<{
        success: boolean;
        amount: number;
        code: 1 | 2 | 3 | 4;
        error?: string;
    }>;
    /**
     * Will increment/decrement with any quantity (i.e. positive for increase, negative for decrease)
     * @param name
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources, 4-Registry not found
     */
    MaterialEdit(name: string, quantity: number): Promise<{
        success: boolean;
        amount: number;
        code: 1 | 2 | 3 | 4;
        error?: string;
    }>;
    /**
     * Increases the given item by the amount.
     * @param itemName
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 4-Registry not found
     */
    ShipIncrement(name: string, quantity: number): Promise<{
        success: boolean;
        amount: number;
        code: 1 | 2 | 3 | 4;
        error?: string;
    }>;
    /**
     * Reduces a given item by the given amount. Cannot reduce below zero.
     * @param itemName
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources, 4-Registry not found
     */
    ShipDecrement(name: string, quantity: number): Promise<{
        success: boolean;
        amount: number;
        code: 1 | 2 | 3 | 4;
        error?: string;
    }>;
    /**
     * Will increment/decrement with any quantity (i.e. positive for increase, negative for decrease)
     * @param name
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources, 4-Registry not found
     */
    ShipEdit(name: string, quantity: number): Promise<{
        success: boolean;
        amount: number;
        code: 1 | 2 | 3 | 4;
        error?: string;
    }>;
    /**
     * Increases the given item by the amount.
     * @param itemName
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 4-Registry not found
     */
    AttachmentIncrement(name: string, quantity: number): Promise<{
        success: boolean;
        amount: number;
        code: 1 | 2 | 3 | 4;
        error?: string;
    }>;
    /**
     * Reduces a given item by the given amount. Cannot reduce below zero.
     * @param itemName
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources, 4-Registry not found
     */
    AttachmentDecrement(name: string, quantity: number): Promise<{
        success: boolean;
        amount: number;
        code: 1 | 2 | 3 | 4;
        error?: string;
    }>;
    /**
     * Will increment/decrement with any quantity (i.e. positive for increase, negative for decrease)
     * @param name
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources, 4-Registry not found
     */
    AttachmentEdit(name: string, quantity: number): Promise<{
        success: boolean;
        amount: number;
        code: 1 | 2 | 3 | 4;
        error?: string;
    }>;
    /**
     * Increases the given item by the amount.
     * @param itemName
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 4-Registry not found
     */
    ReputationIncrement(name: string, quantity: number): Promise<{
        success: boolean;
        amount: number;
        code: 1 | 2 | 3 | 4;
        error?: string;
    }>;
    /**
     * Reduces a given item by the given amount. Cannot reduce below zero.
     * @param itemName
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources, 4-Registry not found
     */
    ReputationDecrement(name: string, quantity: number): Promise<{
        success: boolean;
        amount: number;
        code: 1 | 2 | 3 | 4;
        error?: string;
    }>;
    /**
     * Will increment/decrement with any quantity (i.e. positive for increase, negative for decrease)
     * @param name
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 3-Not Enough Resources, 4-Registry not found
     */
    ReputationEdit(name: string, quantity: number): Promise<{
        success: boolean;
        amount: number;
        code: 1 | 2 | 3 | 4;
        error?: string;
    }>;
    /**
     *
     * @param registryName
     * @param name
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 4-RegistryNotFound
     */
    InventoryIncrement(registryName: TRegistered, name: string, quantity: number): Promise<{
        success: boolean;
        amount: number;
        code: 1 | 2 | 4;
        error?: string;
    }>;
    /**
     * Decrements the item from the given registry by the given amount. Will not allow reduction below 0.
     * @param registryName
     * @param name
     * @param quantity
     * @returns codes: 1-Success, 2-Item Not Found, 3-Not enough items, 4-Registry Not Found
     */
    InventoryDecrement(registryName: TRegistered, name: string, quantity: number): Promise<{
        success: boolean;
        amount: number;
        code: 1 | 2 | 3 | 4;
        error?: string;
    }>;
    InventorySum(inventoryName: TRegistered, gameCollection: Map<string, number>): Promise<boolean>;
    /**
     * Will change the user's quantity of the given item by the given amount. This function requires no duplicate
     * entries to work properly (i.e. there cannot be a faction and a material with the same name). This is the
     * easiest method of inventory manipulation.
     * @param name the name of the item
     * @param quantity the amount to change by (positive or negative)
     * @return codes: 1-Success, 2-Item Not Found, 3-Not enough items, 4-Registry Not Found.
     */
    AutoInventoryEdit(name: string, quantity: number): Promise<{
        success: boolean;
        amount?: number;
        code: 1 | 2 | 3 | 4;
        error?: string;
    }>;
    /**
     * Will change the user's quantity of the given item by the given amount. This function requires no duplicate
     * entries to work properly (i.e. there cannot be a faction and a material with the same name). This is the
     * easiest method of inventory manipulation.
     * @param name the name of the item
     * @param quantity the amount to change by (positive or negative)
     * @return codes: 1-Success, 2-Item Not Found, 3-Not enough items
     */
    BatchAutoInventoryEdit(pairs: {
        name: string;
        quantity: number;
    }[]): Promise<{
        success: boolean;
        code: 1 | 2 | 3;
    }>;
    /**
     * Checks if the user has the sufficient resources to be reduced by the given amount.
     * @param pairs array of {name, quantity} object literals.
     * @param ignoreInvalid Will not check for invalid names (i.e. they will be ignored. An invalid name will not cause a false return value).
     * @returns codes: 1-Success, 2-Item not found, 3-Not enough items
     */
    private BatchSufficientToDecrease;
    /**
     * Will find the user's current quantity of the given item. This function requires no duplicate
     * entries to work properly (i.e. there cannot be a faction and a material with the same name). This is the
     * easiest method of inventory manipulation.
     * @param name the name of the item
     * @return codes: 1-Success, 2-Item Not Found
     */
    AutoInventoryRetrieve(name: string): {
        success: boolean;
        amount?: number;
        code: 1 | 2;
        error?: string;
    };
    /**
     * Will find the user's current quantity of the given item. This function requires no duplicate
     * entries to work properly (i.e. there cannot be a faction and a material with the same name). This is the
     * easiest method of inventory manipulation.
     * @param name the name of the item
     * @return The array returned includes quantities in order they were provided. Items not found will be given quantity of 0.
     */
    BatchAutoInventoryRetrieve(names: string[]): number[];
    save(): Promise<void>;
    constructor(data: IPlayerDocument);
    private static readonly RegistryTypes;
    private static readonly InventoryTypes;
}
