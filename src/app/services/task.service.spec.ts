import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';

// Jasmine specs for a standard Angular CLI test setup.
describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    localStorage.removeItem('taskflow.tasks.v1');
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  afterEach(() => localStorage.removeItem('taskflow.tasks.v1'));

  it('adds a task and persists it', () => {
    const task = { id: 'test-1', title: 'Write tests', description: 'Check the service', status: 'Pending' as const, priority: 'Low' as const, dueDate: '2099-01-01' };
    service.add(task);
    expect(service.getById('test-1')?.title).toBe('Write tests');
    expect(localStorage.getItem('taskflow.tasks.v1')).toContain('test-1');
  });

  it('changes status and deletes a task', () => {
    service.add({ id: 'test-2', title: 'Review code', description: 'Review changes', status: 'Pending', priority: 'Medium', dueDate: '2099-01-01' });
    service.changeStatus('test-2', 'Completed');
    expect(service.getById('test-2')?.status).toBe('Completed');
    service.delete('test-2');
    expect(service.getById('test-2')).toBeUndefined();
  });
});
