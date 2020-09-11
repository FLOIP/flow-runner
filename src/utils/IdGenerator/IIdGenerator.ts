/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

/**
 * Interface for a class that can generate unique IDs. The {@link FlowRunner} needs to generate unique IDs internally,
 * but different projects may have different standards/requirements for ID formats. An implementation of IIdGenerator
 * must be injected into the FlowRunner, which it will use to generate IDs when needed.
 *
 * For a reference version, see {@link IdGeneratorUuidV4}.
 */
export interface IIdGenerator {
  generate(): string
}
