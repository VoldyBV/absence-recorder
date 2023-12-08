import * as Realm from 'realm-web';

const REALM_APP_ID = "absence-recorder-pipdq";
export const app: Realm.App = new Realm.App({ id: REALM_APP_ID });
export const credentials = Realm.Credentials.anonymous();
