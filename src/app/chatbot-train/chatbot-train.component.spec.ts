import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotTrainComponent } from './chatbot-train.component';

describe('ChatbotTrainComponent', () => {
  let component: ChatbotTrainComponent;
  let fixture: ComponentFixture<ChatbotTrainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotTrainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatbotTrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
