import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
    id?: number;
    email: string;
    fullName: string;
    password?: string;
    role?: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8000';

    constructor(private http: HttpClient) { }

    register(user: User): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/register`, {
            email: user.email,
            password: user.password,
            full_name: user.fullName,
            role: user.role || 'user'
        });
    }

    login(credentials: { email: string; password: string }): Observable<AuthResponse> {
        const formData = new FormData();
        formData.append('username', credentials.email);
        formData.append('password', credentials.password);

        return this.http.post<AuthResponse>(`${this.apiUrl}/token`, formData).pipe(
            tap(response => {
                if (response.access_token) {
                    localStorage.setItem('access_token', response.access_token);
                }
            })
        );
    }

    logout() {
        localStorage.removeItem('access_token');
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('access_token');
    }

    getToken(): string | null {
        return localStorage.getItem('access_token');
    }
}
