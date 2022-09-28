import { FormControl } from "@angular/forms";

export interface LoginForm {
    email: FormControl<string | null>;
    password?: FormControl<string | null>;
    remember?: FormControl<boolean | null>;
}


export interface RegisterForm {
    firstName: FormControl<string | null>;
    lastName: FormControl<string | null>;
    email: FormControl<string | null>;
    password: FormControl<string | null>;
    passwordRepeat: FormControl<string | null>;
}