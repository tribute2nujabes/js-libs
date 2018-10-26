// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import * as Api from '@parity/api';

import isObservable from '../utils/isObservable';
import {
  MockProvider,
  rejectApi,
  resolveApi
} from '../utils/testHelpers/mockApi';
import rpc from './rpc';
import { RpcKey, RpcMap, RpcObservable } from '../types';
import { setApi } from '../api';

import * as memProfile from 'memoizee/profile';

// light.js passes around the provider of the api and calls at different locations
// createApiFromProvider to re-create (re-fetch) the api wrapping the provider.
// Because of this we need to mock the api; it isn't enough to set the global api.
jest.mock('@parity/api');
Api.mockImplementation(() => resolveApi('mockmock'));

// TODO USE mockProvider

/**
 * Helper function to make basic tests for RpcObservables.
 *
 * @ignore
 */
const testRpc = (name: string, rpc$: RpcObservable<any, any>) =>
  describe(`${name} rpc`, () => {
    beforeEach(() => {
      setApi(resolveApi('beforeEach'));
    });

    it('should be a function', () => {
      expect(typeof rpc$).toBe('function');
    });

    it('should return an Observable', () => {
      expect(isObservable(rpc$({}))).toBe(true);
    });

    it('result Observable should be subscribable', () => {
      expect(() => rpc$({}).subscribe()).not.toThrow();
    });

    it('result Observable should return values', done => {
      rpc$({}).subscribe(data => {
        expect(data).toBeTruthy();
        done();
      });
    });

    // Memoization tests don't concern post$
    if (name === 'post$') {
      return;
    }

    // use the resolveApi to fix the tests (returns a random id + value)
    // mais c'est pas la mémoization d'api qu'on veut test...
    // c'est la mémoization de l'observable

    // on veut savoir si l'inner observable est réutilisé
    // it('should instantiate the child observable only once when re-running', () => {
    //   const initial$ = rpc$();
    //   const two$ = rpc$();
    //   expect(two$).toBe(initial$);
    // });

    // it('should not return the same Observable if we change Api', () => {
    //   const initial$ = rpc$();
    //   setApi(rejectApi());
    //   expect(rpc$()).not.toBe(initial$);
    // });

    // it('should not return the same Observable if options are passed', () => {
    //   const initial$ = rpc$();
    //   expect(rpc$({ provider: new MockProvider() })).not.toBe(initial$);
    // });

    // it('should return the same Observable if same options are passed', () => {
    //   const provider = new MockProvider();
    //   const initial$ = rpc$({ provider });
    //   expect(rpc$({ provider })).toBe(initial$);
    // });







    // it('should retrieve Api on subscribe and not before', done => {
    //   console.log('START TEST should retrieve Api...')
    //   console.log('START TEST should retrieve Api... setting api#1')
    //   setApi(resolveApi('Api #1'));
    //   const rpcWithResolve$ = rpc$();
    //   rpcWithResolve$.subscribe(r => console.log('rpcWithResolve$ SUBSCRIPTION FIRED',r));

    //   const rpcWithReject$ = rpc$();
    //   console.log('START TEST should retrieve Api... setting api#2')
    //   setApi(resolveApi('Api #2'));
    //   rpcWithReject$.subscribe(r => console.log('rpcWithResolve$ SUBSCRIPTION FIRED',r));

    //   // ça sera jamais les mêmes parce que c'est tjrs un observable différent
    //   // tester le réultat de l'implémentation !! rpcWithResolve$ expect (resolve); rpcWithReject expect reject
    //   expect(rpcWithResolve$).not.toBe(rpcWithReject$); // || expect withreject to reject

    //   setTimeout(() => {
    //     done();
    //   }, 500);
    // });
  });

Object.keys(rpc).forEach(key => testRpc(key, (rpc as RpcMap)[key as RpcKey]));
