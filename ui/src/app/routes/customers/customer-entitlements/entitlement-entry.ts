import { Entitlement } from "src/app/model/entitlement";
import { isNullOrUndefined } from "util";

export class EntitlementEntry {
    static NEXT_ID = 1;
    originalEntitlement: Entitlement = null;
    currentEntitlement: Entitlement = null;
    trialPromptIndex: number;
    selectedTrialPrompt: boolean;
    uniqueId: number;
    changed: boolean;
    
    constructor(originalEntitlement: Entitlement,
        currentEntitlement: Entitlement,
        trialPromptIndex: number = null,
        selectedTrialPrompt: boolean = false) {
        
        this.originalEntitlement = originalEntitlement;
        this.currentEntitlement = currentEntitlement;
        this.trialPromptIndex = trialPromptIndex;
        this.selectedTrialPrompt = selectedTrialPrompt;
        this.updateId();
        this.changed = !Entitlement.areEqual(
            this.originalEntitlement,
            this.currentEntitlement
        );
    }

    static copy(entitlementEntry: EntitlementEntry, 
        {
            originalEntitlement = entitlementEntry.getOriginalEntitlement(),
            currentEntitlement = entitlementEntry.getCurrentEntitlement(),
            trialPromptIndex = entitlementEntry.getTrialPromptIndex(),
            selectedTrialPrompt = entitlementEntry.hasSelectedTrialPrompt()
        }: {
            originalEntitlement?: Entitlement,
            currentEntitlement?: Entitlement,
            trialPromptIndex?: number,
            selectedTrialPrompt?: boolean
        } = {}) {
        
        return new EntitlementEntry(
            originalEntitlement,
            currentEntitlement,
            trialPromptIndex,
            selectedTrialPrompt
        );
    }

    getCurrentEntitlement(): Entitlement {
        return this.currentEntitlement;
    }

    getOriginalEntitlement(): Entitlement {
        return this.originalEntitlement;
    }

    getTrialPromptIndex(): number {
        return this.trialPromptIndex;
    }

    decrementTrialPromptIndex() {
        this.trialPromptIndex--;
        this.updateId();
    }

    setTrialPrompt(trialPromptIndex: number) {
        this.trialPromptIndex = trialPromptIndex;
        this.select();
        this.updateId();
    }

    removeTrialPrompt() {
        this.trialPromptIndex = null;
        this.deselect();
        this.updateId();
    }

    select() {
        this.selectedTrialPrompt = true;
        this.updateId();
    }

    deselect() {
        this.selectedTrialPrompt = false;
        this.updateId();
    }

    setSelected(selected: boolean) {
        this.selectedTrialPrompt = selected;
        this.updateId();
    }

    hasTrialPrompt(): boolean {
        return !isNullOrUndefined(this.trialPromptIndex);
    }

    hasSelectedTrialPrompt(): boolean {
        return this.selectedTrialPrompt;
    }

    hasChanged(): boolean {
        return this.changed;
    }

    undoChange() {
        this.currentEntitlement = Entitlement.copy(this.originalEntitlement);
        this.changed = false;
    }

    getId(): number {
        return this.uniqueId;
    }

    updateId() {
        this.uniqueId = EntitlementEntry.NEXT_ID;
        EntitlementEntry.NEXT_ID++;
    }
}