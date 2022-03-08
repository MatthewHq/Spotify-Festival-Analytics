import * as credManager from './credManager.js';
import * as spotifyRequests from './spotifyRequests.js'
import * as dbManage from './dbManage.js'
async function main() {
    await dbManage.artistCollect()
}

main()