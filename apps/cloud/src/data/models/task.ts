import IridiumStore from '@raincatcher/crud-store';

import * as express from 'express';
import {Collection, Instance, ObjectID} from 'iridium';

export interface Task {
  id: string;
  name: string;
  completed: boolean;
}

@Collection('tasks')
export default class TaskInstance extends Instance<Task, TaskInstance> implements Task {

  public static seedData: Task[] = [
    {
      completed: false,
      id: '1',
      name: 'Make RainCatcher great again'
    }
  ];

  @ObjectID
  public id: string;

  public name: string;
  public completed: boolean;

}
