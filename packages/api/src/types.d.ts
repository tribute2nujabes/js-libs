// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import BigNumber from 'bignumber.js';

export type BlockNumber =
  | 'earliest'
  | 'latest'
  | 'pending'
  | number
  | BigNumber;
