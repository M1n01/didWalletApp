// imports:
// Core interfaces
import { createAgent, IDataStore, IDataStoreORM, IDIDManager, IKeyManager, IResolver } from '@veramo/core'

// Core identity manager plugin. This allows you to create and manage DIDs by orchestrating different DID provider packages.
// This implements `IDIDManager`
import { DIDManager } from '@veramo/did-manager'

// Core key manager plugin. DIDs use keys and this key manager is required to know how to work with them.
// This implements `IKeyManager`
import { KeyManager } from '@veramo/key-manager'

// This plugin allows us to create and manage `did:peer` DIDs (used by DIDManager)
import { PeerDIDProvider } from '@veramo/did-provider-peer'

// A key management system that uses a local database to store keys (used by KeyManager)
import { KeyManagementSystem, SecretBox } from '@veramo/kms-local'

// Storage plugin using TypeORM to link to a database
import { Entities, KeyStore, DIDStore, migrations, PrivateKeyStore } from '@veramo/data-store'

// TypeORM is installed with '@veramo/data-store'
import { DataSource } from 'typeorm'

const DB_ENCRYPTION_KEY = '29739248cad1bd1a0fc4d9b75cd4d2990de535baf5caadfdf8d8f86664aa830c'

let dbConnection = new DataSource({
  type: 'expo',
  driver: require('expo-sqlite'),
  database: 'veramo.sqlite',
  migrations: migrations,
  migrationsRun: true,
  logging: ['error', 'info', 'warn'],
  entities: Entities,
}).initialize()

export const agent = createAgent<IDIDManager & IKeyManager & IDataStore & IDataStoreORM>({
  plugins: [
    new KeyManager({
      store: new KeyStore(dbConnection),
      kms: {
        local: new KeyManagementSystem(new PrivateKeyStore(dbConnection, new SecretBox(DB_ENCRYPTION_KEY))),
      },
    }),
    new DIDManager({
      store: new DIDStore(dbConnection),
      defaultProvider: 'did:peer',
      providers: {
        'did:peer': new PeerDIDProvider({
          defaultKms: 'local'
        }),
      },
    }),
  ],
})
