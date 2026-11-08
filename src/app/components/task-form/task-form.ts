import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { Task, TaskStatus, TaskPriority } from '../../models/task';
import { TaskService } from '../../services/task.service';

function today(): string {
  const date = new Date(); //Φτιάχνουμε ένα js object για την τρέχουσα ημερομηνία και ώρα
  const year = date.getFullYear(); //Παίρνουμε τον τρέχοντα χρόνο
  const month = String(date.getMonth() + 1).padStart(2, '0'); //Για να πάρουμε σωστά τους μήνες
  const day = String(date.getDate()).padStart(2, '0'); //Για να πάρουμε σωστά τις μέρες
  return `${year}-${month}-${day}`; //Eπιστρέφει ημερομηνία στο παρακάτω format: (ΥΥΥY-MM-DD)
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `

    <!-- Αλλάζει την επικεφαλίδα μεταξύ "Create Task" και "Edit Task" ανάλογα με το τι κάνει ο χρήστης (πχ Φτιάχνει καινούργιο task ή τροποποιεί καπιό υπάρχων task) -->
    <div class="page-heading">
      <div>
        <div class="eyebrow">TASK MANAGEMENT</div>
        <h1>{{ editing ? 'Edit Task' : 'Create Task' }}</h1>
        <p>
          {{ editing
            ? 'Update the details of your task.'
            : 'Add something new to your workspace.' }}
        </p>
      </div>
      <a routerLink="/tasks" class="btn secondary">
        ← Back
      </a>
    </div>

    <!-- Εμφανίζει ένα error εάν ο χρήστης προσπαθήσει να ανοίξει ενα task που δεν υπάρχει (ή έχει διαγραφεί...). Αλλιώς δείχνει την φόρμα για να φτιάξουμε η να τροποποιήσουμε ενα task -->
    @if (missing) {
      <section class="panel empty">
        <h2>Task not found</h2>
        <p>This task may have been deleted.</p>
        <a routerLink="/tasks" class="btn primary">
          Back to Dashboard
        </a>
      </section>
    } @else {
      <section class="panel form-panel">
        <form [formGroup]="form" (ngSubmit)="save()">
          <div class="form-group">
            <label for="title">Task Title *</label>
            <input
              id="title"
              class="field"
              formControlName="title"
              placeholder="What needs to be done?"
            />

            <!-- Title validator | Πρέπει να έχει 5 χαρακτήρες -->
            @if (invalid('title')) {
              <small class="error">
                Title must contain at least 5 characters.
              </small>
            }
          </div>

          <div class="form-group">
            <label for="description">Description *</label>
            <textarea
              id="description"
              class="field"
              formControlName="description"
              rows="5"
              placeholder="Describe your task..."
            ></textarea>

            <!-- Description validator | Πρέπει να υπάρχει περιγραφή -->
            @if (invalid('description')) {
              <small class="error">
                Description is required.
              </small>
            }
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label for="status">Status</label>
              <select
                id="status"
                class="field"
                formControlName="status">
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div class="form-group">
              <label for="priority">Priority</label>
              <select
                id="priority"
                class="field"
                formControlName="priority">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="dueDate">Due Date *</label>
            <input
              id="dueDate"
              type="date"
              class="field"
              formControlName="dueDate"
              [min]="minDate"
            />

            <!-- Date validator | Η ημερομινία πρέπει να είναι ή σημερινή ή μελλοντική -- όχι παρελθοντική -->
            @if (invalid('dueDate')) {
              <small class="error">
                Select today or a future date.
              </small>
            }
          </div>

          <div class="form-actions">
            <a routerLink="/tasks" class="btn secondary">
              Cancel
            </a>
            <button type="submit" class="btn primary">
              {{ editing ? 'Save Changes' : 'Create Task' }}
            </button>
          </div>
        </form>
      </section>
    }
  `
})
export class TaskFormComponent {
  minDate = today();
  taskId: string | null = null;
  editing = false;
  missing = false;

  form;
  
  constructor(
    private fb: FormBuilder,
    private service: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.taskId = this.route.snapshot.paramMap.get('id');
    this.editing = this.taskId !== null;

    const oldTask = this.taskId ? this.service.getById(this.taskId) : undefined;
    this.missing = this.editing && !oldTask;

    this.form = this.fb.nonNullable.group({
      title: [oldTask?.title ?? '', [Validators.required, Validators.minLength(5)]],
      description: [oldTask?.description ?? '', [Validators.required]],
      status: [oldTask?.status ?? 'Pending' as TaskStatus, [Validators.required]],
      priority: [oldTask?.priority ?? 'Medium' as TaskPriority, [Validators.required]],
      dueDate: [oldTask?.dueDate ?? '', [Validators.required]]
    });
  }

  //Validator (touched) | Ελένχει εάν ένα πεδίο είναι μη-έγκυρο μονο εαν ο χρήστης έχει κάνει click σε αυτό
  invalid(field: string): boolean {
    const control = this.form.get(field);
    if (!control) return false;
    if (!control.touched && !control.dirty) return false;
    if (field === 'dueDate' && control.value < today()) return true;
    return control.invalid;
  }

  //Form validator | Αποθηκεύει δεδόμενα της φόρμας, δημιουργεί ένα νεο task / τροποποιεί ένα υπάρχων task, και επιστρέφει τον χρήστη στην λίστα με όλα τα tasks
  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.missing) return;

    const values = this.form.getRawValue();
    const title = values.title.trim();
    const description = values.description.trim();

    if (title.length < 5) {
      this.form.controls.title.setErrors({ minlength: true });
      return;
    }
    if (description.length === 0) {
      this.form.controls.description.setErrors({ required: true });
      return;
    }
    if (values.dueDate < today()) {
      this.form.controls.dueDate.setErrors({ pastDate: true });
      return;
    }

    const task: Task = {
      id: this.taskId ?? crypto.randomUUID(),
      title: title,
      description: description,
      status: values.status,
      priority: values.priority,
      dueDate: values.dueDate
    };

    if (this.editing) {
      this.service.update(task);
    } else {
      this.service.add(task);
    }
    this.router.navigate(['/tasks']);
  }
}

