import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { TaskStatus } from '../../models/task';
import { TaskService } from '../../services/task.service';


@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-heading">
      <div>
        <div class="eyebrow">TASK DETAILS</div>
        <h1>Task Overview</h1>
        <p>Review and manage your task.</p>
      </div>
      <a routerLink="/tasks" class="btn secondary">
        ← Back
      </a>
    </div>
    


    @if (task(); as current) {
      <section class="panel details-panel">
        <div class="detail-header">
          <div>
            <h2>{{ current.title }}</h2>
            <span
              class="badge"
              [ngClass]="current.priority.toLowerCase()">
              {{ current.priority }} Priority
            </span>
          </div>

          <a
            [routerLink]="['/tasks/edit', current.id]"
            class="btn secondary">
            Edit Task
          </a>
        </div>

        <div class="detail-section">
          <h3>Description</h3>
          <p>{{ current.description }}</p>
        </div>

        <div class="detail-grid">
          <div>
            <label>Status</label>
            <span
              class="status"
              [ngClass]="statusClass(current.status)">
              ● {{ current.status }}
            </span>
          </div>

          <div>
            <label>Due Date</label>
            <strong>{{ current.dueDate }}</strong>
          </div>

          <div>
            <label>Priority</label>
            <strong>{{ current.priority }}</strong>
          </div>

          <div>
            <label>Task ID</label>
            <code>{{ current.id }}</code>
          </div>
        </div>

        <div class="detail-section">
          <h3>Quick Status Change</h3>
          <div class="button-row">
            <button
              class="btn secondary"
              (click)="changeStatus('Pending')">
              Pending
            </button>
            <button
              class="btn secondary"
              (click)="changeStatus('In Progress')">
              In Progress
            </button>
            <button
              class="btn primary"
              (click)="changeStatus('Completed')">
              ✓ Completed
            </button>
          </div>
        </div>

        <div class="danger-zone">
          <div>
            <strong>Delete this task</strong>
            <p>This action cannot be undone.</p>
          </div>
          <button class="btn danger" (click)="remove()">
            Delete Task
          </button>
        </div>
      </section>
    } @else {
      <section class="panel empty">
        <h2>Task not found</h2>
        <p>The requested task does not exist.</p>
        <a routerLink="/tasks" class="btn primary">
          Return to Dashboard
        </a>
      </section>
    }
  `
})
export class TaskDetailsComponent {
  private service = inject(TaskService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly id = this.route.snapshot.paramMap.get('id') ?? '';
  readonly task = computed(() => this.service.getById(this.id));

  statusClass(status: TaskStatus): string {
    return status.toLowerCase().replaceAll(' ', '-');
  }

  changeStatus(status: TaskStatus): void {
    if (!this.task()) return;
    this.service.changeStatus(this.id, status);
  }

  remove(): void {
    const current = this.task();
    if (!current) return;
    if (confirm('Delete "' + current.title + '"?')) {
      this.service.delete(this.id);
      this.router.navigate(['/tasks']);
    }
  }
}
