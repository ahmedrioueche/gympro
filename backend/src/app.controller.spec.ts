import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(() => {
    appController = new AppController();
  });

  describe('wake', () => {
    it('should return status awake with timestamp', () => {
      const result = appController.wake();
      expect(result.status).toBe('awake');
      expect(result.timestamp).toBeDefined();
    });
  });
});
