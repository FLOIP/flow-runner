export enum Actions {
  ActiveStatus = 'activeStatus',
  Language = 'language',
  ContentType = 'contentType',
  CustomData = 'customData'
}

export default interface ISetContactPropertyBlockConfig {
  propertyName: string,
  propertyValue: string
}
