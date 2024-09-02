// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ApiService } from '../api.service';
// import { RouterModule } from '@angular/router';
// import { error } from 'node:console';

// @Component({
//   selector: 'app-chatbot-list',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   template: `
//     <div class="space-y-4">
//       <h2 class="text-2xl font-bold">Your Chatbots</h2>   <button (click)="clear_code()" class="bg-black text-white px-4 py-2 rounded  hover:bg-black"> Clear Code </button>
//       <div *ngFor="let chatbot of chatbots" class="border p-4 rounded">
//         <h3 class="text-xl font-semibold">{{ chatbot.name }}</h3>
//         <div class="mt-2 space-x-2">
//           <button (click)="trainChatbot(chatbot.id)" class="bg-black text-white px-3 py-1 rounded hover:bg-black">Train</button>
//           <button (click)="deleteChatbot(chatbot.id)" class="bg-black text-white px-3 py-1 rounded hover:bg-black">Delete</button>
//           <button (click)="generate_code(chatbot.id)" class="bg-black text-white px-3 py-1 rounded hover:bg-black">Integration Code</button>
//           <a [routerLink]="['/chat', chatbot.id]" class="bg-black text-white px-3 py-1 rounded hover:bg-black">Chat</a>
//           <button class='px-3 py-1 bg-blue rounded'> trained with {{fileName}}</button>
//         </div>
      
//       </div>
      
//       <button (click)="createChatbot()" class="bg-black text-white px-4 py-2 rounded hover:bg-black">Create New Chatbot</button>
//     </div>
//     <br/>
//     <div class="bg-white shadow overflow-hidden sm:rounded-lg p-6">
//           <h2 class="text-xl font-semibold mb-4">Integration Code</h2>
//           <pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto">
//           <code>{{integrationCode}}</code>
//           </pre>
//           </div>
//   `,
//   styles: [],
// })
// export class ChatbotListComponent implements OnInit {
//   chatbots: any[] = [];
//   integrationCode: string = '';
//   response1:string='';
//   fileName:string='';

//   constructor(private apiService: ApiService) {}

//   ngOnInit() {
//     this.fetchChatbots();
//   }

//   fetchChatbots() {
//     this.apiService.getChatbots().subscribe(
//       (response) => {
//         this.chatbots = response;
//       },
//       (error) => {
//         console.error('Failed to fetch chatbots', error);
//       }
//     );
//   }

//   createChatbot() {
//     const name = prompt('Enter chatbot name:');
//     if (name) {
//       this.apiService.createChatbot(name).subscribe(
//         (response) => {
//           console.log('Chatbot created successfully');
//           this.fetchChatbots();  // Refresh the chatbot list
//         },
//         (error) => {
//           console.error('Failed to create chatbot', error);
//         }
//       );
//     }
//   }

//   trainChatbot(chatbotId: string) {
//     const input = document.createElement('input');
//     input.type = 'file';
//     input.accept = '.pdf';  // Adjust the accepted file types as needed

//     input.onchange = () => {
//       const file = input.files?.[0];
//       if (file) {
//         this.apiService.trainChatbot(chatbotId, file).subscribe(
//           (response) => {
//             console.log('Chatbot trained successfully');
//             this.fileName=file.name
//             // Handle any additional logic after training
//           },
//           (error) => {
//             console.error('Failed to train chatbot', error);
//           }
//         );
//       }
//     };

//     input.click();
//   }

//   generate_code(chatbotId:string){
//     this.apiService.getIntegration_code(chatbotId).subscribe(
//       (response) =>{
//         this.integrationCode = response.integration_code;
//         console.log("Integration code generated");
//       },
//       (error) =>{
//         console.error('failed to fet integration code', error);
//       }
//     );
    
//   }

//   clear_code(){
//     this.integrationCode=this.response1;
//   }


//   deleteChatbot(chatbotId: string) {
//     if (confirm('Are you sure you want to delete this chatbot?')) {
//       this.apiService.deleteChatbot(chatbotId).subscribe(
//         (response) => {
//           console.log('Chatbot deleted successfully');
//           this.fetchChatbots();  // Refresh the chatbot list
//         },
//         (error) => {
//           console.error('Failed to delete chatbot', error);
//         }
//       );
//     }
//   }
// }


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Chatbot {
  id: string;
  name: string;
  trainedFile?: string;
}

@Component({
  selector: 'app-chatbot-list',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule],
  template: `
   <div class="space-y-4">
  <h2 class="text-2xl font-bold">Your Chatbots</h2>
  <button (click)="clearIntegrationCode()" class="btn btn-secondary">Clear Code</button>
  
  <div *ngFor="let chatbot of chatbots" class="border p-4 rounded">
    <h3 class="text-xl font-semibold">{{ chatbot.name }}</h3>
    <div class="mt-2 space-x-2">
      <button (click)="showTrainForm(chatbot)" class="btn btn-primary">Train</button>
      <button (click)="deleteChatbot(chatbot.id)" class="btn btn-danger">Delete</button>
      <button (click)="generateCode(chatbot.id)" class="btn btn-info">Integration Code</button>
      <a [routerLink]="['/chat', chatbot.id]" class="btn btn-success">Chat</a>
      <span *ngIf="chatbot.trainedFile" class="badge badge-info">
        Trained with: {{ chatbot.trainedFile }}
      </span>
    </div>
  </div>
  
  <button (click)="createChatbot()" class="btn btn-primary">Create New Chatbot</button>
</div>

<!-- Train Form Modal -->
<div *ngIf="showForm" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75">
  <div class="bg-white p-6 rounded-lg shadow-lg">
    <h3 class="text-lg font-bold mb-4">Train Chatbot</h3>
    <form (submit)="onTrainSubmit()">
      <div class="mb-4">
        <label for="apiUrl" class="block text-sm font-medium text-gray-700">API URL</label>
        <input id="apiUrl" type="text" [(ngModel)]="apiUrl" name="apiUrl" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
      </div>
      <div class="mb-4">
        <label for="pdfFile" class="block text-sm font-medium text-gray-700">Upload PDF</label>
        <input id="pdfFile" type="file" (change)="onFileSelected($event)" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
      </div>
      <div class="flex justify-end">
        <button type="button" (click)="hideForm()" class="btn btn-secondary mr-2">Cancel</button>
        <button type="submit" class="btn btn-primary">Submit</button>
      </div>
    </form>
  </div>
</div>

  `,
  styles: [`
    .btn {
      @apply px-4 py-2 rounded;
    }
    .btn-primary {
      @apply bg-black text-white hover:bg-black;
    }
    .btn-secondary {
      @apply bg-black text-white hover:bg-black;
    }
    .btn-danger {
      @apply bg-black text-white hover:bg-black;
    }
    .btn-info {
      @apply bg-black text-white hover:bg-black;
    }
    .btn-success {
      @apply bg-black text-white hover:bg-black;
    }
    .badge {
      @apply px-2 py-1 rounded text-sm;
    }
    .badge-info {
      @apply bg-blue-100 text-blue-800;
    }
    .message {
      @apply px-4 py-2 rounded mt-4;
    }
    .success {
      @apply bg-green-100 text-green-800;
    }
    .error {
      @apply bg-red-100 text-red-800;
    }
  `],
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

  constructor(private apiService: ApiService) {}

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
    this.apiService.getIntegration_code(chatbotId).subscribe({
      next: (response) => {
        this.integrationCode = response.integration_code;
        this.showSuccessMessage('Integration code generated');
      },
      error: (error) => {
        this.showErrorMessage('Failed to get integration code');
        console.error('Failed to get integration code', error);
      }
    });
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