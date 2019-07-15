import { Entitlement } from "src/app/model/entitlement";
import { isNullOrUndefined } from "util";

export class EntitlementEntry {
    originalEntitlement: Entitlement = null;
    currentEntitlement: Entitlement = null;
    trialPromptIndex: number;
    selectedTrialPrompt: boolean;
    
    constructor(originalEntitlement: Entitlement,
        currentEntitlement: Entitlement,
        trialPromptIndex: number = null,
        selectedTrialPrompt: boolean = false) {
        
        this.originalEntitlement = originalEntitlement;
        this.currentEntitlement = currentEntitlement;
        this.trialPromptIndex = trialPromptIndex;
        this.selectedTrialPrompt = selectedTrialPrompt;
        
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
    }

    setTrialPrompt(trialPromptIndex: number) {
        this.trialPromptIndex = trialPromptIndex;
        this.select();
    }

    removeTrialPrompt() {
        this.trialPromptIndex = null;
        this.deselect();
    }

    select() {
        this.selectedTrialPrompt = true;
    }

    deselect() {
        this.selectedTrialPrompt = false;
    }

    setSelected(selected: boolean) {
        this.selectedTrialPrompt = selected;
    }

    hasTrialPrompt(): boolean {
        return !isNullOrUndefined(this.trialPromptIndex);
    }

    hasSelectedTrialPrompt(): boolean {
        return this.selectedTrialPrompt;
    }

    hasChanged(): boolean {
        return !Entitlement.areEqual(
            this.originalEntitlement,
            this.currentEntitlement
        );
    }

    undoChange() {
        this.currentEntitlement = this.originalEntitlement;
    }
}