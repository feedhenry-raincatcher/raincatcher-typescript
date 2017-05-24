import BaseStep from './BaseStep';
/**
 * Simple step example that hits a remote http endpoint
 */
class HttpRequestStep extends BaseStep {
  public getOptions: () => {
    properties: {
      url: {
        type: 'string',
        description: 'URL of the endpoint to make a request to'
      }
    },
    required: ['url']
  };
}
