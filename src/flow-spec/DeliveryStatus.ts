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

export enum DeliveryStatus {
  QUEUED =  'QUEUED',
  RINGING =  'RINGING',
  IN_PROGRESS =  'IN_PROGRESS',
  WAITING_TO_RETRY =  'WAITING_TO_RETRY',
  FAILED_NO_ANSWER =  'FAILED_NO_ANSWER',
  FINISHED_COMPLETE =  'FINISHED_COMPLETE',
  FINISHED_INCOMPLETE =  'FINISHED_INCOMPLETE',
  // FAILED_NO_CREDIT =  'FAILED_NO_CREDIT',
  FAILED_NETWORK =  'FAILED_NETWORK',
  FAILED_CANCELLED =  'FAILED_CANCELLED',
  SENT =  'SENT',
  FINISHED_VOICEMAIL =  'FINISHED_VOICEMAIL',
  FAILED_VOICEMAIL =  'FAILED_VOICEMAIL',
  FAILED_ERROR =  'FAILED_ERROR',
}
