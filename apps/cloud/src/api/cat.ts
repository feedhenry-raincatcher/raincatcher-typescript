import * as express from 'express';
import Store from '@raincatcher/store';
import webapi, {WebApiConfig, StoreApiService} from '@raincatcher/webapi';

function generateID() {
  let id = Math.floor((Math.random() * 9000) + 1000);
  return id.toString();
}

interface Cat {
  id: string,
  name: string,
  img: string
}

const config: WebApiConfig = {
  limits: true
};

const hosico: Cat = {
  id: generateID(),
  name: 'Hosico',
  img: 'http://hosicocat.com/uploads/s/k/f/c/kfczm7nn5wgl/img/full_HRz64eK1.jpg'
};

const nala: Cat = {
  id: generateID(),
  name: 'Nala',
  img: 'https://yt3.ggpht.com/-e_4F9h4RV5c/AAAAAAAAAAI/AAAAAAAAAAA/SWIdn-KqE74/s900-c-k-no-mo-rj-c0xffffff/photo.jpg'
};

const catStore = new Store<Cat>([hosico, nala]);
const catStoreService = new StoreApiService<Cat>(catStore);
const catRouter: express.Router = webapi(catStoreService, config);

export default catRouter;
