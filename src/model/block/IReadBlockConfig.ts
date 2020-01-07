export default interface IReadBlockConfig {

  /** This is a "scanf"-compatible format string, where any %-characters will be read into context variables. */
  formatString: string // todo: should this be message?

  /** This is a list of strings, containing the variable names in the context where the results will be stored.
   *  The number of variable names must match the number of %-characters in format_string. */
  destinationVariables: string[]
}