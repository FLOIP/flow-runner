// https://floip.gitbooks.io/flow-specification/content/fundamentals/flows.html
class Flow {
    uuid?: string;
    name?: string
    label?: string // optional
    last_modified?: string // UTC
    interaction_timeout?: number
    platform_metadata?: object
    supported_modes?: Mode[]
    languages?: string[]
    blocks?: Block[]
}
