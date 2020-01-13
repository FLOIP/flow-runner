export class InvalidChoiceException<ChoiceType> extends Error {
  constructor(message?: string,
              public choices?: ChoiceType[]) {
    super(message)
  }
}

export default InvalidChoiceException