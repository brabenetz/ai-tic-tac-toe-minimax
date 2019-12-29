import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { DropdownModule, Dropdown } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayComponent } from './play/play.component';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        AppComponent,
        PlayComponent,
    ],
    imports: [
        FormsModule,
        NoopAnimationsModule,
        BrowserModule,
        AppRoutingModule,
        MenubarModule,
        DropdownModule,
        ButtonModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
