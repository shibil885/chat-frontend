import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewChatListComponent } from './new-chat-list.component';

describe('NewChatListComponent', () => {
  let component: NewChatListComponent;
  let fixture: ComponentFixture<NewChatListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewChatListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewChatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
