// Your web app's Firebase configuration
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/functions'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDtMc_SEmUlREsrrwCNRU2HEXm4Tgm72RU',
  authDomain: 'awesome-shop-ja.firebaseapp.com',
  projectId: 'awesome-shop-ja',
  storageBucket: 'awesome-shop-ja.appspot.com',
  messagingSenderId: '472273608137',
  appId: '1:472273608137:web:1bf63893f391bc16785c18',
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
export const auth = firebase.auth()
export const functions = firebase.functions()
export const db = firebase.firestore()
export const storageRef = firebase.storage().ref()
export { firebase }
