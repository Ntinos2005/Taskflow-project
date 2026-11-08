import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Task, TaskStatus } from '../../models/task';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-heading">
      <div>
        <div class="eyebrow">YOUR WORKSPACE</div>
        <h1>Dashboard</h1>
        <p>Stay organized. Increase productivity.</p>
      </div>
      <a routerLink="/tasks/new" class="btn primary">
        + New Task
      </a>
    </div>

    <div class="stats">
      <div class="stat-card">
        <span>Total Tasks</span>
        <strong>{{ service.total() }}</strong>
        <small>All your work</small>
      </div>

      <div class="stat-card">
        <span>In Progress</span>
        <strong class="blue">{{ countStatus('In Progress') }}</strong>
        <small>Currently active</small>
      </div>

      <div class="stat-card">
        <span>Completed</span>
        <strong class="green">{{ countStatus('Completed') }}</strong>
        <small>Finished tasks</small>
      </div>

      <div class="stat-card">
        <span>Pending</span>
        <strong class="yellow">{{ countStatus('Pending') }}</strong>
        <small>Waiting to start</small>
      </div>
    </div>

    <section class="panel">
      <div class="panel-heading">
        <div>
          <h2>My Tasks</h2>
          <p>Manage and track your work</p>
        </div>
        <span class="count">{{ filteredTasks().length }} tasks</span>
      </div>

      <div class="toolbar">
        <input
          class="field search"
          placeholder="Search tasks by title..."
          [value]="searchText"
          (input)="searchText = $any($event.target).value"
        />

        <select
          class="field filter"
          [value]="selectedStatus"
          (change)="setFilter($any($event.target).value)">
          <option value="All">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <!-- Αν δεν βρεί tasks, δείχνει το παρακατώ HTML block. Αλλιώς δειχνει τα υπαρχοντα tasks. -->
      @if (filteredTasks().length === 0) {
        <div class="empty">
          <div class="empty-icon">☷</div>
          <h3>No tasks found</h3>
          <p>
            Try changing your filters or creating a new task.
          </p>
          <a routerLink="/tasks/new" class="btn primary">
            Create Task
          </a>
        </div>
      } @else {
        <div class="task-list">
          @for (task of filteredTasks(); track task.id) {
            <div class="task-row">
              <div class="task-info">
                <div class="task-title-line">
                  <a [routerLink]="['/tasks', task.id]"
                     class="task-title">
                    {{ task.title }}
                  </a>

                  <span
                    class="badge"
                    [ngClass]="task.priority.toLowerCase()">
                    {{ task.priority }}
                  </span>
                </div>

                <p>{{ task.description }}</p>

                <div class="task-meta">
                  <span>◷ {{ task.dueDate }}</span>
                  <span
                    class="status"
                    [ngClass]="statusClass(task.status)">
                    ● {{ task.status }}
                  </span>
                </div>
              </div>

              <div class="task-actions">
                <a
                  [routerLink]="['/tasks/edit', task.id]"
                  class="btn secondary small">
                  Edit
                </a>
                <button
                  class="btn danger small"
                  (click)="remove(task)">
                  Delete
                </button>
              </div>
            </div>
          }
        </div>
      }
    </section>
  `
})
export class TaskListComponent {
  searchText = '';
  selectedStatus = 'All';

  constructor(public service: TaskService) {}

  filteredTasks(): Task[] {
    const results: Task[] = [];
    for (const task of this.service.tasks()) {
      const titleMatches = task.title.toLowerCase()
        .includes(this.searchText.toLowerCase().trim());
      const statusMatches =
        this.selectedStatus === 'All' || task.status === this.selectedStatus;

      if (titleMatches && statusMatches) {
        results.push(task);
      }
    }
    return results;
  }

  countStatus(status: TaskStatus): number {
    return this.service.countStatus(status);
  }

  setFilter(value: string): void {
    this.selectedStatus = value;
  }

  statusClass(status: TaskStatus): string {
    return status.toLowerCase().replaceAll(' ', '-');
  }

  remove(task: Task): void {
    if (confirm('Delete "' + task.title + '"?')) {
      this.service.delete(task.id);
    }
  }
}

