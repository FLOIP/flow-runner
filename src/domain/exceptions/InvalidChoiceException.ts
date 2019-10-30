export default class InvalidChoiceException<ChoiceType> extends Error {
  constructor(message?: string,
              public choices?: ChoiceType[]) {
    super(message)
  }
}