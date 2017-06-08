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

export default class Task {
  constructor(protected repository: TaskRepository, store: CrudStore<Task>) {
  }
  // ...
}
