export interface TaskRepository {
  findByUser(userId: string): Promise<Task>;
  findActive(): Promise<Task[]>;
  getSteps(taskId: string): Promise<Step[]>;
}

/**
 * Module can have our own mongo-based supported implementation
 */
export class MongoTaskRepository implements TaskRepository {

}

export interface Step{};

export interface CrudStore<T> {
  create(data: T): Promise<T>;
  get(id: string): Promise<T>;
  find(): Promise<T[]>;
  update(id: string, data: T): Promise<T>;
  delete(id: string): Promise<T>;
}

export default class Task {
  constructor(protected repository: TaskRepository, store: CrudStore<Task>) {
  }
  // ...
}
