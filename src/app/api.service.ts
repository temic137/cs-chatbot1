import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5000';  // Update this to your Flask backend URL

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/login`, { username, password }, { withCredentials: true });
  }
  logout(){
    return this.http.post(`${this.apiUrl}/logout`,{}, { withCredentials: true });
  }

  register(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/register`, { username, password }, { withCredentials: true });
  }

  createChatbot(name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/create_chatbot`, { name }, { withCredentials: true });
  }

  trainChatbot(chatbotId: string, file: File | null, apiUrl: string | null): Observable<any> {
    const formData = new FormData();

    if (file) {
      formData.append('file', file);
    }

    if (apiUrl) {
      formData.append('apiUrl', apiUrl);
    }

    return this.http.post(`${this.apiUrl}/train_chatbot/${chatbotId}`, formData, { withCredentials: true });
  }

  deleteChatbot(chatbotId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete_chatbot/${chatbotId}`, { withCredentials: true });
  }

  askChatbot(chatbotId: string, question: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}/chatbot/${chatbotId}/ask`, { question }, { withCredentials: true });
  }

  getChatbots(): Observable<any> {
    return this.http.get(`${this.apiUrl}/chatbots`, { withCredentials: true });
  }
  getIntegration_code(chatbotId: string): Observable<any>{
    return this.http.get(`${this.apiUrl}/get_chatbot_script/${chatbotId}`,{ withCredentials: true });
  }

}

