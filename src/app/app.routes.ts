import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ChatbotListComponent } from './chatbot-list/chatbot-list.component';
import { ChatbotChatComponent } from './chatbot-chat/chatbot-chat.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'chatbots', component: ChatbotListComponent },
    { path: 'chat/:id', component: ChatbotChatComponent },
  ];
