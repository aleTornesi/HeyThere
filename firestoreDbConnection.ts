import {initializeApp, getApps, getApp} from 'firebase/app'
import {getFirestore} from 'firebase/firestore'
import firebaseConfig from './firebaseConfig'


export default () => {
    if(!getApps().length) initializeApp(firebaseConfig);
    return getFirestore(getApp())
}