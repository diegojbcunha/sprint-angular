import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface LoginForm {
  nome: string;
  senha: string;
}

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  usuario: LoginForm = {
    nome: '',
    senha: ''
  };

  errorMessage: string | null = null;
  successMessage: string | null = null;
  isLoading = false;
  showPassword = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    if (!this.isFormValid()) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    this.startLogin();

    this.authService.login(this.usuario).subscribe({
      next: (response) => this.handleLoginSuccess(response),
      error: (err) => this.handleLoginError(err)
    });
  }

  private isFormValid(): boolean {
    return !!(this.usuario.nome && this.usuario.senha);
  }

  private startLogin(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
  }

  private handleLoginSuccess(response: any): void {
    console.log('Login efetuado com sucesso!', response);
    this.isLoading = false;
    this.successMessage = 'Login efetuado com sucesso!';

    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 1500);
  }

  private handleLoginError(err: any): void {
    console.log('Erro ao efetuar o login', err);
    this.isLoading = false;
    
    if (err.status === 401) {
      this.errorMessage = 'Credenciais inválidas. Use admin/123456 para fazer login.';
    } else {
      this.errorMessage = 'Erro ao conectar com o servidor. Tente novamente.';
    }
  }
}
