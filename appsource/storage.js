import { AsyncStorage } from 'react-native';
import Storage from 'react-native-storage';

const version = 'v1';

const storageBackend = new Storage({
    
    size: 1000,

    storageBackend: AsyncStorage,

    defaultExpires: 1000 * 3600 * 24,

    enableCache: true,

    sync : {

    }
})



const storage = {

  set: function (key, obj){

    return storageBackend.save({
      key: version + '-' + key,
      rawData: obj,

      expires: 1000 * 3600
    });

  },


  get: function (key){

    return new Promise(function(resolve, reject){


      try {

        storageBackend.load({
            key: version + '-' + key,

            autoSync: true,

            syncInBackground: true
        }).then(ret => {

            console.log('STORAGE RESOLVE GET: ret', ret);
            resolve(ret);
        }).catch(err => {

            console.log('Storage Failed to find anything for key', key);
            switch (err.name) {
                case 'NotFoundError':

                    break;
                case 'ExpiredError':

                    break;
                default:
                  console.log('STORAGE RESOLVE GET: catch', err);
                  break;
            }
            resolve(null);
        })
      }catch(err){
        console.log('--fail,shoot--');
      }

    });

  }
}



global.storage = storage;
