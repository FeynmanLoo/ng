import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawLogComponent } from './withdraw-log.component';

describe('WithdrawLogComponent', () => {
  let component: WithdrawLogComponent;
  let fixture: ComponentFixture<WithdrawLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
