import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
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
    TopicModalDeleteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
