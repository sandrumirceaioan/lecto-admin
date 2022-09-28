export interface SideMenuItem {
    path: string;
    title: string;
    icon: string;
    allow: UserRoles[];
  }

  export enum UserRoles {
    admin = 'admin',
    user = 'user',
  }