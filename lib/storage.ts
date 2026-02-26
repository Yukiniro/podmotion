import { createStorage } from 'unstorage'
import indexedDbDriver from 'unstorage/drivers/indexedb'

const storage = createStorage({
  driver: indexedDbDriver({ base: 'podmotion:', dbName: 'podmotion' }),
})

export { storage }
