import { Injectable } from '@angular/core';
import { BehaviorSubject, delay } from 'rxjs';
import { SideMenuItem, UserRoles } from '../shared/models/layout.model';


@Injectable({
    providedIn: 'root'
})
export class AdminService {
    public loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    private sideMenuItems: SideMenuItem[] = [
        { path: 'utilizatori', title: 'Utilizatori', icon: 'people', allow: [UserRoles.admin, UserRoles.user] },
        { path: 'profesori', title: 'Profesori', icon: 'school', allow: [UserRoles.admin, UserRoles.user] },
        { path: 'locatii', title: 'Locatii', icon: 'place', allow: [UserRoles.admin, UserRoles.user] },
        { path: 'cursuri', title: 'Cursuri', icon: 'folder_special', allow: [UserRoles.admin, UserRoles.user] },
        { path: 'sesiuni', title: 'Sesiuni', icon: 'date_range', allow: [UserRoles.admin, UserRoles.user] },
        { path: 'pagini', title: 'Pagini', icon: 'pages', allow: [UserRoles.admin, UserRoles.user] },
        { path: 'setari', title: 'Setari', icon: 'settings', allow: [UserRoles.admin] },
    ];

    constructor() { }

    getMenuItems(): SideMenuItem[] {
        return this.sideMenuItems;
    }

    setLoading(value: boolean): void {
        setTimeout(() => {
            this.loading$.next(value);
        }, 0);
    }

}
