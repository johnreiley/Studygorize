import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  firebaseConfig: any = {
    apiKey: "AIzaSyASKQiRVlhFSC-g2Fv3itEv37ZJLTlqrd4",
    authDomain: "studygorize.firebaseapp.com",
    databaseURL: "https://studygorize.firebaseio.com",
    projectId: "studygorize",
    storageBucket: "studygorize.appspot.com",
    messagingSenderId: "176833976176",
    appId: "1:176833976176:web:ec87e478f4931d7c56a1b5",
    measurementId: "G-6L11DEE95V"
  };
  firebaseInstance: any;  

  constructor() { 
    firebase.initializeApp(this.firebaseConfig);
    this.firebaseInstance = firebase;
  }

  getCollectionReference(uid: string, key: string) {
    console.log('getCollectionReference()')
    return this.firebaseInstance.firestore().collection(`users/${uid}/${key}`);
  }
}
