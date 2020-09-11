/*
 * Copyright (c) Viamo, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file in the root directory of this source tree.
 */

/**
 * Extracted function encapsulating date string formatted like `2020-01-17 17:58:08.090Z`.
 * @param date
 */
export function createFormattedDate(date: Date = new Date()): string {
  return date.toISOString().replace('T', ' ')
}
