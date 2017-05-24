/**
 * Created by acunningham on 22/05/17.
 */
import Store from '@raincatcher/store';
import webapi, {ApiService, StoreApiService, WebApiConfig}  from '@raincatcher/webapi';
import * as express from 'express';
import userSeedData from "../users";


// Define User datatype
interface user {
  id: string,
  name: string,
  position?: string,
  phone?: string,
  email?: string,
  notes?: string,
  avatar?: string,
  banner?: string,
}

// Setup configuration
const config: WebApiConfig = {
  limits: true
};

const userStore = new Store<user>(userSeedData);

const userService = new StoreApiService<user>(userStore);
const userRoute: express.Router = webapi(userService, config);

export default userRoute;
