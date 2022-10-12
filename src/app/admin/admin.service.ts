import { Injectable } from '@angular/core';
import { BehaviorSubject, delay } from 'rxjs';
import { SideMenuItem, UserRoles } from '../shared/models/layout.model';


@Injectable({
    providedIn: 'root'
})
export class AdminService {
    public loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    private sideMenuItems: SideMenuItem[] = [
        // { path: 'sites', title: 'Sites', icon: 'language', allow: [UserRoles.admin, UserRoles.user] },
        // { path: 'categories', title: 'Categories', icon: 'article', allow: [UserRoles.admin, UserRoles.user] },
        // { path: 'articles', title: 'Articles', icon: 'wysiwyg', allow: [UserRoles.admin, UserRoles.user] },
        // { path: 'widgets', title: 'Widgets', icon: 'widgets', allow: [UserRoles.admin, UserRoles.user] },
        { path: 'utilizatori', title: 'Utilizatori', icon: 'people', allow: [UserRoles.admin] },
        { path: 'profesori', title: 'Profesori', icon: 'school', allow: [UserRoles.admin] },
        { path: 'locatii', title: 'Locatii', icon: 'place', allow: [UserRoles.admin] },
        { path: 'cursuri', title: 'Cursuri', icon: 'folder_special', allow: [UserRoles.admin] },
        { path: 'sesiuni', title: 'Sesiuni', icon: 'date_range', allow: [UserRoles.admin] },
        // { path: 'discounturi', title: 'Discounturi', icon: 'money_off', allow: [UserRoles.admin] },
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
