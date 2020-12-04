import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateOptionsComponent } from './create-options/create-options.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './login/signup/signup.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { ImportComponent } from './topics/import/import.component';
import { StudyComponent } from './topics/study/study.component';
import { TestComponent } from './topics/test/test.component';
import { TopicEditComponent } from './topics/topic-edit/topic-edit.component';
import { SetEditComponent } from './topics/topic-view/set-edit/set-edit.component';
import { SetViewComponent } from './topics/topic-view/set-view/set-view.component';
import { TopicViewComponent } from './topics/topic-view/topic-view.component';
import { TopicsComponent } from './topics/topics.component';

const routes: Routes = [
  { path: '', redirectTo: '/topics', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'create', component: CreateOptionsComponent, canActivate: [AuthGuard], pathMatch: 'full'},
  { path: 'topics', component: TopicsComponent, canActivate: [AuthGuard], pathMatch: 'full'},
  { path: 'topics/new', component: TopicEditComponent, canActivate: [AuthGuard], pathMatch: 'full'},
  { path: 'topics/import', component: ImportComponent, canActivate: [AuthGuard], pathMatch: 'full'},
  { path: 'topics/:id', component: TopicViewComponent, canActivate: [AuthGuard], pathMatch: 'full'},
  { path: 'topics/:id/edit', component: TopicEditComponent, canActivate: [AuthGuard], pathMatch: 'full'},
  { path: 'topics/:id/new-set', component: SetEditComponent, canActivate: [AuthGuard], pathMatch: 'full'},
  { path: 'topics/:id/set/:setId', component: SetViewComponent, canActivate: [AuthGuard], pathMatch: 'full'},
  { path: 'topics/:id/set/:setId/edit', component: SetEditComponent, canActivate: [AuthGuard], pathMatch: 'full'},
  { path: 'topics/:id/study', component: StudyComponent, canActivate: [AuthGuard], pathMatch: 'full'},
  { path: 'topics/:id/test', component: TestComponent, canActivate: [AuthGuard], pathMatch: 'full'},
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard], pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
