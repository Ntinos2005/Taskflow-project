# TaskFlow - Task Management Application

Built with: Angular.

## Features

-Create new task(s).
-Edit existing task(s).
-Delete existing task(s).
-View individual task details.
-Change task status (In Progress | Pending | Completed).
-Search tasks by title.
-Filter tassk by status.
-Form validation.
-Browser localStorage.
-Responsive interface.

## Technologies

-Angular + Standalone Components.
-TypeScript.
-Angular Signals.
-Angular Reactive Forms.
-Angular Router.
-HTML & CSS.
-Browser localStorage.

## Installation

Install Node.js and Angular CLI.

Open a terminal in the project folder and write:

```bash
npm install
ng serve
```

Open the application at:

http://localhose:4200


## Application Routes

|Route | Description|
|---|---|
|/tasks | Dashboard|
|/tasks/new | Create a task|
|/tasks/edit/id: | Edit a task|
|/tasks/:id | View task details|


## Data Storage

Task data is stored in the browser using localStorage.

## Validation

-Title: required, minimum charachters: 5.
-Description: requrired.
-Due Date: required, today's date or future date.
-Status: Pending, In Progress, Completed.
-Priority: Low, Medium, High.

## Architecture

Angular + Standalone Components.

TaskService manages task data using Angular Signals.
Computed signals provide reactive dashboard statistics.

TaskListComponent displays and filters tasks.
TaskFormComponent handles task creation and editing.
TaskDetailsComponent provides task information and actions.

## Running a Production Build

```bash
ng build
```

The generated output is placed in the dist directory.


## Notes

Use to run the application if other commands do not work:

``` bash
npm.cmd start
```
