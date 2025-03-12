import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorField } from '@app/helpers/ValidatorField';
import { UserUpdate } from '@app/models/identity/UserUpdate';
import { AccountService } from '@app/services/account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {

  userUpdate = {} as UserUpdate;
  form!: FormGroup;

    constructor(public fb: FormBuilder,
                public accountService: AccountService,
                private router: Router,
                private toaste: ToastrService,
                private spinner: NgxSpinnerService
    ) { }

    get f() : any{
      return this.form.controls;
    }

  ngOnInit() {
    this.validation();
    this.carregarUsuario();
  }

  onSubmit(): void {
    this.atualizarUsuario();
  }

  public atualizarUsuario(){
    this.userUpdate = { ...this.form.value };
    this.spinner.show();
    this.accountService
       .updateUser(this.userUpdate)
       .subscribe(
         () => this.toaste.success('Usuário atualizado!', 'Sucesso'),
         (error) => {
           this.toaste.error(error.error);
           console.error(error);
         }
       )
       .add(() => this.spinner.hide());
  }

  private carregarUsuario(): void {
    this.spinner.show();
    this.accountService
      .getUser()
      .subscribe(
        (userRetorno: UserUpdate) => {
          console.log(userRetorno);
          this.userUpdate = userRetorno;
          this.form.patchValue(this.userUpdate);
          this.toaste.success('Usuário Carregado', 'Sucesso');
        },
        (error) => {
          console.error(error);
          this.toaste.error('Usuário não Carregado', 'Erro');
          this.router.navigate(['/dashboard']);
        }
      )
      .add(() => this.spinner.hide());
  }


  public validation(): void {

      const formOptions: AbstractControlOptions = {
        validators: ValidatorField.MustMatch('password', 'confirmePassword')
      };

      this.form = this.fb.group({
        userName: [''],
        primeiroNome: ['', Validators.required],
        ultimoNome: ['', Validators.required],
        titulo: ['NaoInformado', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', Validators.required],
        funcao: ['NaoInformado', Validators.required],
        descricao: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(4)]],
        confirmePassword: ['', Validators.required],
      }, formOptions);
  }

    public resertForm(event: any): void{
      event.preventDefault();
      this.form.reset();
    }



}
