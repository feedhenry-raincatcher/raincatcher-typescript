import { Connection, Model, Document } from 'mongoose';
type SchemaBuilder = (db: Connection) => Model<Document>;
export default SchemaBuilder;
