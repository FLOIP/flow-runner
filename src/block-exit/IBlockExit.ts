/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

export interface IBlockExit {
  uuid: string

  // resource
  label: string

  tag: string
  destinationBlock?: string
  semanticLabel?: string
  test?: string
  config: object

  // todo: should we rename this to isDefault to capture boolean type?
  // todo: we need to update docs -- they specify "key presence", but I'd prefer us to be more explicit
  default?: boolean
}

export interface IBlockExitTestRequired extends IBlockExit {
  test: string
}
