import { Injectable, computed, signal } from '@angular/core';
import { Task, TaskStatus } from '../models/task';

const STORAGE_KEY = 'taskflow.tasks.v1';

//Υπολογίζει/Συγκρίνει μια μελλοντική ή παρελθοντική ημερομηνία σε σχέση με τη συμερινή και την επιστρέφει στο παρακάτω format: (YYYY-MM-DD)
function futureDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private taskState = signal<Task[]>(this.loadTasks());
  readonly tasks = this.taskState.asReadonly();
  readonly total = computed(() => this.tasks().length);

  //Μετράει το πόσα tasks υπάρχουν άνα status (πχ 5 "In progress" tasks, 1 "Completed" task)
  countStatus(status: TaskStatus): number {
    let count = 0;
    for (const task of this.tasks()) {
      if (task.status === status) count++;
    }
    return count;
  }

  //Βρίσκει και επιστρέφει ένα task βάσει του ID του
  getById(id: string): Task | undefined {
    return this.tasks().find(task => task.id === id);
  }

  //Βάζει ένα νέο task στη λίστα με τα υπόλιπα υπάρχωντα tasks
  add(task: Task): void {
    this.setTasks([task, ...this.tasks()]);
  }

  //Ενημερώνει ένα υπάρχων task στην λίστα βάσει του ID του
  update(updatedTask: Task): void {
    const updated = this.tasks().map(task =>
      task.id === updatedTask.id ? { ...updatedTask } : task
    );
    this.setTasks(updated);
  }

  //Ενημερώνει το status ενώς συγκεκριμένου task βάσει του ID του
  changeStatus(id: string, status: TaskStatus): void {
    const task = this.getById(id);
    if (task) this.update({ ...task, status });
  }

  //Διαγράφει ένα  task από την λίστα βάσει του ID του
  delete(id: string): void {
    this.setTasks(this.tasks().filter(task => task.id !== id));
  }

  //Ενημερώνει το signal των tasks και ενημερώνει/συγχρονίζει την λίστα των tasks με το localStorage
  private setTasks(tasks: Task[]): void {
    this.taskState.set(tasks);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.warn('Tasks could not be saved.', error);
    }
  }

  //Φορτώνει και διαβάζει/αναλύει την λίστα των tasks από το localStorage
  private loadTasks(): Task[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const data: unknown = JSON.parse(saved);
        if (Array.isArray(data)) return data as Task[];
      }
    } catch (error) {
      console.warn('Saved tasks could not be loaded.', error);
    }
    //demo tasks για testing
    return [
      { id: 'demo-1', title: 'Design the dashboard/application', description: 'Create TaskFlow interface and layout.', status: 'Completed', priority: 'High', dueDate: futureDate(2) },
      { id: 'demo-2', title: 'Implement task management', description: 'Build creation, editing, and deletion features.', status: 'In Progress', priority: 'High', dueDate: futureDate(5) },
      { id: 'demo-3', title: 'Write project documentation', description: 'Prepare README MD and setup instructions.', status: 'Pending', priority: 'Medium', dueDate: futureDate(9) }
    ];
  }
}
