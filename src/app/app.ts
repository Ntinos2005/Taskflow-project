import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="shell">
      <aside class="sidebar">
        <a routerLink="/tasks" class="brand">
          <span class="brand-icon">✦</span>
          <span>TaskFlow</span>
        </a>

        <div class="nav-caption">WORKSPACE</div>

        <nav>
          <a
            routerLink="/tasks"
            routerLinkActive="active"
            class="nav-link">
            ◫ &nbsp; Dashboard
          </a>

          <a
            routerLink="/tasks/new"
            routerLinkActive="active"
            class="nav-link">
            ＋ &nbsp; Create Task
          </a>
        </nav>

        <div class="sidebar-bottom">
          <span class="online-dot"></span> <!-- Δεν χρειάζετε αλλά εεεεε -->
          Local workspace
          <small>Your tasks stay in this browser</small>
        </div>
      </aside>

      <main class="main">
        <header class="topbar">
          <div class="breadcrumbs">Workspace / TaskFlow</div>
          <div class="avatar">TF</div>
        </header>

        <div class="page">
          <router-outlet />
        </div>
      </main>
    </div>
  `
})
export class App {}

//Exports για να δουλέυει το  app.routs.ts
export { TaskListComponent } from './components/task-list/task-list';
export { TaskFormComponent } from './components/task-form/task-form';
export { TaskDetailsComponent } from './components/task-details/task-details';
