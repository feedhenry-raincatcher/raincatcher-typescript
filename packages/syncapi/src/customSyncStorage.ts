import { HasId, Store } from '@raincatcher/store';


class CustomSyncStorage<T extends HasId>{
    public store: Store<T>;

    public constructor(store: Store<T>) {
        this.store = store;
    }

    public function dataListHandler(datasetId: any, queryParams: any, metadata: any, cb: any) {
        
    }
    public function dataCreateHandler(datasetId: any, queryParams: any, metadata: any, cb: any) {

    }

    public function dataSaveHandler(datasetId: any, queryParams: any, metadata: any, cb: any) {

    }

    public function dataGetHandler(datasetId: any, queryParams: any, metadata: any, cb: any) {

    }

    public function dataDeleteHandler(datasetId: any, queryParams: any, metadata: any, cb: any) {

    }



}


