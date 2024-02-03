import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Task {
  id: number;
  description: string;
  done: boolean;
}

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  newTask: string = '';
  tasks: Task[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchTasks();
  }
//to add task which will be added by user
  addTask() {
    if (this.newTask.trim() !== '') {
      const newTask = { description: this.newTask, done: false };

      this.http.post<Task>('http://localhost:3000/tasks', newTask).subscribe(response => {
        this.tasks.push(response);
        this.newTask = '';
      });
    }
  }

  //edit task means prompt will be asked
  editTask(index: number) {
    const newDescription = prompt('Edit task:', this.tasks[index].description);
    if (newDescription !== null) {
      this.tasks[index].description = newDescription;
      this.updateTaskOnServer(this.tasks[index]);
    }
  }

  deleteTask(index: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      const deletedTask = this.tasks.splice(index, 1)[0];
      this.deleteTaskOnServer(deletedTask);
    }
  }

  private fetchTasks() {
    this.http.get<Task[]>('http://localhost:3000/tasks').subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  private updateTaskOnServer(task: Task) {
    this.http.put(`http://localhost:3000/tasks/{task.id}`, task).subscribe();
  }

  private deleteTaskOnServer(task: Task) {
    this.http.delete(`http://localhost:3000/tasks/{task.id}`).subscribe();
  }
}
