/**
 * Flow Interoperability Project (flowinterop.org)
 * Flow Runner
 * Copyright (c) 2019, 2020 Viamo Inc.
 * Authored by: Brett Zabos (brett.zabos@viamo.io)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 **/

import IContext, {ICursor, IReversibleUpdateOperation} from './IContext'
import IFlow from './IFlow'
import IContact from './IContact'
import DeliveryStatus from './DeliveryStatus'
import IBlockInteraction from './IBlockInteraction'
import {IResource, IResources, SupportedMode} from '..'
import ResourceResolver from '../domain/ResourceResolver'

export class Context implements IContext {
  constructor(
    public id: string,
    public createdAt: string,
    public deliveryStatus: DeliveryStatus,

    public mode: SupportedMode,
    public languageId: string,

    public contact: IContact,
    public sessionVars: any,
    public interactions: IBlockInteraction[],
    public nestedFlowBlockInteractionIdStack: string[],
    public reversibleOperations: IReversibleUpdateOperation[],

    public flows: IFlow[],
    public firstFlowId: string,
    public resources: IResources,

    public entryAt?: string,
    public exitAt?: string,
    public userId?: string,
    public orgId?: string,
    public cursor?: ICursor,
    public platformMetadata: object = {},

    public logs: any = {}
  ) {}

  getResource(resourceId: string): IResource {
    return new ResourceResolver(this)
      .resolve(resourceId)
  }
}

export default Context