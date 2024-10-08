import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Chatbot {
  id: string;
  name: string;
  trainedFile?: string;
}

@Component({
  selector: 'app-chatbot-list',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl:'./chatbot-list.component.html',
  styleUrl:'./chatbot-list.component.css',
  
})
export class ChatbotListComponent implements OnInit {
  chatbots: Chatbot[] = [];
  integrationCode: string = '';
  message: string = '';
  isSuccess: boolean = true;
  showForm: boolean = false;
  selectedChatbot!: Chatbot;
  apiUrl: string = '';
  selectedFile: File | null = null;

  constructor(private apiService: ApiService, private router:Router) {}

  ngOnInit() {
    this.fetchChatbots();
  }

  fetchChatbots() {
    this.apiService.getChatbots().subscribe({
      next: (response) => {
        this.chatbots = response;
      },
      error: (error) => {
        this.showErrorMessage('Failed to fetch chatbots');
        console.error('Failed to fetch chatbots', error);
      }
    });
  }

  showTrainForm(chatbot: Chatbot) {
    this.selectedChatbot = chatbot;
    this.showForm = true;
  }

  createChatbot() {
    const name = prompt('Enter chatbot name:');
    if (name) {
      this.apiService.createChatbot(name).subscribe({
        next: () => {
          this.showSuccessMessage('Chatbot created successfully');
          this.fetchChatbots();
        },
        error: (error) => {
          this.showErrorMessage('Failed to create chatbot');
          console.error('Failed to create chatbot', error);
        }
      });
    }
  }

  hideForm() {
    this.showForm = false;
    this.apiUrl = '';
    this.selectedFile = null;
  }
  logout1(){
    this.apiService.logout().subscribe(
      (response) => {
        console.log('Logged Out successfully');
        this.router.navigate(['/login']);
      },
    )
    
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onTrainSubmit() {
    if (this.apiUrl || this.selectedFile) {
      this.apiService.trainChatbot(this.selectedChatbot.id, this.selectedFile, this.apiUrl).subscribe({
        next: () => {
          if (this.selectedFile) {
            this.selectedChatbot.trainedFile = this.selectedFile.name;
          }
          this.showSuccessMessage('Chatbot trained successfully');
          this.hideForm();
        },
        error: (error) => {
          this.showErrorMessage('Failed to train chatbot');
          console.error('Failed to train chatbot', error);
        }
      });
    } else {
      this.showErrorMessage('Please provide an API URL or upload a PDF file');
    }
  }

  generateCode(chatbotId: string) {

    this.apiService.getIntegration_code(chatbotId).subscribe(
            (response) =>{
              this.integrationCode = response.integration_code;
              console.log("Integration code generated");
            },
            (error) =>{
              console.error('failed to fet integration code', error);
            }
          );
  }

  clearIntegrationCode() {
    this.integrationCode = '';
  }

  deleteChatbot(chatbotId: string) {
    if (confirm('Are you sure you want to delete this chatbot?')) {
      this.apiService.deleteChatbot(chatbotId).subscribe({
        next: () => {
          this.showSuccessMessage('Chatbot deleted successfully');
          this.fetchChatbots();
        },
        error: (error) => {
          this.showErrorMessage('Failed to delete chatbot');
          console.error('Failed to delete chatbot', error);
        }
      });
    }
  }

  private showSuccessMessage(message: string) {
    this.message = message;
    this.isSuccess = true;
    this.clearMessageAfterDelay();
  }

  private showErrorMessage(message: string) {
    this.message = message;
    this.isSuccess = false;
    this.clearMessageAfterDelay();
  }

  private clearMessageAfterDelay() {
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }
}