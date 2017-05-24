import Step from '../step';
/**
 * Workflow is the definition holder for a set of Steps that can become a Task
 */
interface Workflow {
  id: string;
  /** Description for UI */
  name: string;
  steps: Step[];
}
export default Workflow;
