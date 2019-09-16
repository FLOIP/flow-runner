export default class InvalidChoiceException<ChoiceType> extends Error {
    choices?: ChoiceType[] | undefined;
    constructor(message?: string, choices?: ChoiceType[] | undefined);
}
//# sourceMappingURL=InvalidChoiceException.d.ts.map