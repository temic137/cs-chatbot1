import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ChatbotListComponent } from './chatbot-list/chatbot-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoginComponent, RegisterComponent, ChatbotListComponent],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-4">CS Chatbots</h1>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [],
})
export class AppComponent {}