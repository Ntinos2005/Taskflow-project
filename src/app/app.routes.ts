import { Routes } from '@angular/router';
import { TaskListComponent, TaskFormComponent, TaskDetailsComponent } from './app';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'tasks', component: TaskListComponent },
  { path: 'tasks/new', component: TaskFormComponent },
  { path: 'tasks/edit/:id', component: TaskFormComponent },
  { path: 'tasks/:id', component: TaskDetailsComponent },
  { path: '**', redirectTo: 'tasks' }
];
