import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayComponent } from './play/play.component';
import { InformationComponent } from './information/information.component';
import { TestingComponent } from './testing/testing.component';


const routes: Routes = [
  { path: '', redirectTo: '/play', pathMatch: 'full' },
  { path: 'play', component: PlayComponent },
  { path: 'testing', component: TestingComponent },
  { path: 'information', component: InformationComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
