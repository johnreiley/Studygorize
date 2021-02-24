import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
// import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { Router, Scroll } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './login/signup/signup.component';
import { TopicsComponent } from './topics/topics.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SettingsComponent } from './settings/settings.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { TopicLiteComponent } from './topics/topic-lite/topic-lite.component';
import { TopicEditComponent } from './topics/topic-edit/topic-edit.component';
import { AttributeCardComponent } from './topics/topic-edit/attribute-card/attribute-card.component';
import { TopicViewComponent } from './topics/topic-view/topic-view.component';
import { SetLiteComponent } from './topics/topic-view/set-lite/set-lite.component';
import { TopicModalDeleteComponent } from './topics/topic-modal-delete/topic-modal-delete.component';
import { SetEditComponent } from './topics/topic-view/set-edit/set-edit.component';
import { SetViewComponent } from './topics/topic-view/set-view/set-view.component';
import { TagBadgeComponent } from './shared/components/tag-badge/tag-badge.component';
import { StudyComponent } from './topics/study/study.component';
import { StudyCardComponent } from './topics/study/study-card/study-card.component';
import { CreateOptionsComponent } from './create-options/create-options.component';
import { ImportComponent } from './topics/import/import.component';
import { TestComponent } from './topics/test/test.component';
import { MultipleChoiceQuestionComponent } from './topics/test/multiple-choice-question/multiple-choice-question.component';
import { ShortAnswerQuestionComponent } from './topics/test/short-answer-question/short-answer-question.component';
import { TestOptionsComponent } from './topics/test/test-options/test-options.component';
import { PartyComponent } from './party/party.component';
import { PartyWaitingRoomComponent } from './party/party-waiting-room/party-waiting-room.component';
import { PartyOptionsComponent } from './party/party-options/party-options.component';

// const socketConfig: SocketIoConfig = { url: 'http://localhost:8080', options: { withCredentials: false } };

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    TopicsComponent,
    NavbarComponent,
    SettingsComponent,
    LoadingSpinnerComponent,
    TopicLiteComponent,
    TopicEditComponent,
    AttributeCardComponent,
    TopicViewComponent,
    SetLiteComponent,
    TopicModalDeleteComponent,
    SetEditComponent,
    SetViewComponent,
    TagBadgeComponent,
    StudyComponent,
    StudyCardComponent,
    CreateOptionsComponent,
    ImportComponent,
    TestComponent,
    MultipleChoiceQuestionComponent,
    ShortAnswerQuestionComponent,
    TestOptionsComponent,
    PartyComponent,
    PartyWaitingRoomComponent,
    PartyOptionsComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    DragDropModule,
    // SocketIoModule.forRoot(socketConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(router: Router, viewportScroller: ViewportScroller) {
    router.events.pipe(
      filter((e): e is Scroll => e instanceof Scroll)
    ).subscribe((e: Scroll) => {
      if (e.position) {
        // backward navigation
        setTimeout(() => {
          viewportScroller.scrollToPosition(e.position);
        }, 0);
      } else if (e.anchor) {
        // anchor navigation
        viewportScroller.scrollToAnchor(e.anchor);
      } else {
        // forward navigation
        viewportScroller.scrollToPosition([0, 0]);
      }
    });
  }
}
