import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SpinnerModule } from 'primeng/spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayComponent } from './play/play.component';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PlayGroundComponent } from './play-ground/play-ground.component';
import { InformationComponent } from './information/information.component';
import { TestingComponent } from './testing/testing.component';

@NgModule({
    declarations: [
        AppComponent,
        PlayComponent,
        PlayGroundComponent,
        InformationComponent,
        TestingComponent,
    ],
    imports: [
        FormsModule,
        NoopAnimationsModule,
        BrowserModule,
        AppRoutingModule,
        MenubarModule,
        DropdownModule,
        ButtonModule,
        CheckboxModule,
        SpinnerModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
