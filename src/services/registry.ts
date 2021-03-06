/**
 * @description fndi registration function for the services
 * @author jpichardo
 */

import { validate } from 'class-validator';

import * as grpc from 'grpc';

import { promisify } from '../utils';
import { EngineService } from './engineService';

function businessProtoPackageSelector(load, selector) {
  return selector(load.jp.tamagotchi);
}

export function servicesRegistration(registry) {
  registry({
    factory: resolve => {
      const config = resolve('config');
      const path = config.engineProtoPath;

      return businessProtoPackageSelector(
        grpc.load(path),
        protoPackage => protoPackage.engine
      ).ExecutionService.service;
    },
    name: 'protoEngineService',
    persist: true
  });
  registry({ name: 'validate', value: validate });
  registry({ type: EngineService });
}
