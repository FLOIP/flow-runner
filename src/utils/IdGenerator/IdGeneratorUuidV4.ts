/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

import {IIdGenerator} from '../../index'
import uuid from 'uuid'

/**
 * Implementation of {@link IIdGenerator} that generates UUIDv4-format IDs.
 */
export class IdGeneratorUuidV4 implements IIdGenerator {
  generate(): string {
    return uuid.v4()
  }
}
