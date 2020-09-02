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
                label: 'Training',
                icon: 'pi pi-fw pi-share-alt', // the share symbol looks like a very small neuronal net.
                // icon: 'pi pi-fw pi-sliders-h', // slider horizontal if there are diffent settings to train
                routerLink: 'training',
            },
            {
                label: 'Testing',
                icon: 'pi pi-fw pi-fast-forward',
                routerLink: 'testing',
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
