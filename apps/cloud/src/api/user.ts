/**
 * Created by acunningham on 23/05/17.
 */

/**
 * Created by acunningham on 22/05/17.
 */
// Example shows that modules can be extended now in demo application codebase.
// This example setup Restfull API for tasks backed by application store
// Example proves that we do not need to have separate modules for simple datasets.
import Store from '@raincatcher/store';
// Express.js based out of the box api service
import webapi, {ApiService, StoreApiService, WebApiConfig}  from '@raincatcher/webapi';
import * as express from 'express';

// Define new datatype
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
// This example is simple but it shows alternative way for developers to extend module functionality.
// Service by default wrapes store, but developers can extend store (or just particular methods)
// To provide custome functionality additionally some different store can be injected into implementation.
const userService = new StoreApiService<User>(userStore);
const userRouter: express.Router = webapi(userService, config);

export default userRouter;
