import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../api.service';
import { ChatbotListComponent } from '../chatbot-list/chatbot-list.component';

@Component({
  selector: 'app-chatbot-chat',
  standalone: true,
  imports: [CommonModule, FormsModule,ChatbotListComponent,RouterLink],
  templateUrl:'./chatbot-chat.component.html',
  styleUrl: './chatbot-chat.component.css',
})
export class ChatbotChatComponent implements OnInit {
  chatbotId: string = '';
  chatbotName: string = '';
  messages: any[] = [];
  currentMessage: string = '';

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.chatbotId = this.route.snapshot.paramMap.get('id') || '';
    // Fetch chatbot name from API
    this.chatbotName = 'Chatbot';
  }

  sendMessage() {
    if (this.currentMessage.trim()) {
      this.messages.push({ sender: 'user', text: this.currentMessage });
      this.apiService.askChatbot(this.chatbotId, this.currentMessage).subscribe(
        (response) => {
          this.messages.push({ sender: 'bot', text: response.answer });
        },
        (error) => {
          console.error('Failed to get chatbot response', error);
        }
      );
      this.currentMessage = '';
    }
  }
}