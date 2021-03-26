import * as admin from 'firebase-admin'
import * as restoreService from './import'
import * as backupService from './export'
import { IExportOptions, IImportOptions } from './helper'

interface IInitializeAppOptions {
  firestore?: FirebaseFirestore.Settings
}

/**
 * Initialize Firebase App
 *
 * @param {object} serviceAccount
 * @param {string} name
 * @param {IInitializeAppOptions} options
 */
export const initializeApp = (
  serviceAccount: object,
  name = '[DEFAULT]',
  options: IInitializeAppOptions = {}
) => {
  if (
    admin.apps.length === 0 ||
    (admin.apps.length > 0 && admin.app().name !== name)
  ) {
    admin.initializeApp(
      {
        credential: admin.credential.cert(serviceAccount),
        databaseURL: serviceAccount['databaseURL'],
      },
      name
    )
    admin.firestore().settings({ timestampsInSnapshots: true, ...options.firestore })
  }
  return true
}

export { admin }

/**
 * Backup data from firestore
 *
 * @param {string} collectionName
 * @param {IExportOptions} options
 * @return {json}
 */
export const backup = (collectionName: string, options?: IExportOptions) => {
  return backupService.backup(collectionName, options)
}

/**
 * Restore data to firestore
 * @param fileName
 * @param options
 */
export const restore = (
  fileName: string | Object,
  options: IImportOptions = {}
) => {
  return restoreService.restore(fileName, options)
}

/**
 * Get all collections data
 * @param {Array<string>} collectionNameArray
 * @param {IExportOptions} options
 */
export const backups = (
  collectionNameArray: Array<string> = [],
  options?: IExportOptions
) => {
  return backupService.getAllCollections(collectionNameArray, options)
}
