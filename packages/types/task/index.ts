import Step from '../step';
import Workflow from '../workflow';
// TODO: replace with proper reference
type User = any;

interface Task {
  id: string;
  assigneeId: string;
  assignee: User;
  // multiple Users might want to watch a Task's progression
  watcherIds: string[];
  watchers: User[];
  workflowId: string;
  workflow: Workflow;
  currentStep: Step;
}
export default Task;
