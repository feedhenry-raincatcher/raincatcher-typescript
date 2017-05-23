/**
 * Created by acunningham on 22/05/17.
 */
import Store from '@raincatcher/store';
import webapi, {ApiService, StoreApiService, WebApiConfig}  from '@raincatcher/webapi';
import * as express from 'express';

interface User {
  id: string,
  username: string,
  name: string,
  position: string,
  phone: string,
  email: string,
  notes: string,
  avatar: string,
  banner: string,
}

// Setup configuration
const config: WebApiConfig = {
  limits: true
};

// Create sample data
const sampleUser: User =   {
  "id" : "156340",
  "username" : "trever",
  "name" : "Trever Smith",
  "position" : "Senior Truck Driver",
  "phone" : "(265) 725 8272",
  "email" : "trever@wfm.com",
  "notes" : "Trever doesn't work during the weekends.",
  "avatar" : "https://s3.amazonaws.com/uifaces/faces/twitter/kolage/128.jpg",
  "banner" : "http://web18.streamhoster.com/pentonmedia/beefmagazine.com/TreverStockyards_38371.jpg"
};

const userStore = new Store<User>([sampleUser]);
const userService = new StoreApiService<User>(userStore);
const userRouter: express.Router = webapi(userService, config);

export default userRouter;
