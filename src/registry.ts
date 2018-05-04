import * as bunyan from 'bunyan';
import { Server as GrpcServer } from 'grpc';

import { Server } from './server';

import { EngineService } from '@services/engineService';

export function registration(env) {
  return registry => {
    registry({ name: 'config', value: require(`config/config.${env}`) });

    registry({
      factory: resolve =>
        bunyan.createLogger({ name: 'TSEngineServiceLogger' }),
      name: 'log'
    });
    registry({
      factory: resolve => className => resolve('log').child({ className }),
      name: 'logFactory'
    });

    registry({
      factory: resolve => {
        const services = [
          {
            implementation: resolve(EngineService),
            service: resolve('protoEngineService')
          }
        ];
        const logFactory = resolve('logFactory');

        const grpcServer = new GrpcServer();

        const config = resolve('config');

        return new Server(grpcServer, config, services, logFactory);
      },
      type: Server
    });
  };
}
