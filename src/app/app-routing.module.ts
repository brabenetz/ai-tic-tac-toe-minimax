import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayComponent } from './play/play.component';
import { InformationComponent } from './information/information.component';


const routes: Routes = [
  { path: '', redirectTo: '/play', pathMatch: 'full' },
  { path: 'play', component: PlayComponent },
  { path: 'information', component: InformationComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
