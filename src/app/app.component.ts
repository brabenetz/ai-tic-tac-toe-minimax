import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'ai-tic-tac-toe-minimax';

    items: MenuItem[];

    ngOnInit() {
        this.items = [
            {
                label: 'Play',
                icon: 'pi pi-fw pi-play',
                routerLink: 'play',
            },
            {
                label: 'Info',
                icon: 'pi pi-fw pi-info',
                routerLink: 'information',
                styleClass: 'menubar-information',
            }
        ];
    }
}
