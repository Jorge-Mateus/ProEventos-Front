import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {

  modalRef = {} as BsModalRef;
  public eventos: Evento[] = [];
  public eventosFiltrados:  Evento[] = [];
  public eventoId = 0;

  public larguraImagem = 150;
  public margemImagem = 2;
  public exibirImagem = true;
  private _filtroListado: string = '';

  public get filtroLista(): string{
    return this._filtroListado;
  }

  public set filtroLista(value: string){
    this._filtroListado = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  public filtrarEventos(filtrarPor: string):Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento: { tema: string; local: string; }) => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 ||
      evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }
  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  public ngOnInit(): void {
    this.spinner.show();
    this.CarregarEventos();

  }

  public alterarImagem(): void{
    this.exibirImagem = !this.exibirImagem;
  }

  public CarregarEventos(): void{
    const observer = {
      next: (eventosResp: Evento[]) => {
        this.eventos = eventosResp;
        this.eventosFiltrados = this.eventos;
      },
      error: (error: any) =>{
        this.spinner.hide();
        this.toastr.error("Erro ao Carregar os Eventos", "Erro!");
      },
      complete: () =>{
        this.spinner.hide();
        }
    };
    this.eventoService.getEventos().subscribe(observer);
  }

  openModal(event: any,template: TemplateRef<any>, eventoId: number): void {
    event.stopPropagation();
    this.eventoId = eventoId;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(): void {
    this.modalRef.hide();
    this.spinner.show();
    this.eventoService.deleteEvento(this.eventoId).subscribe(
      (result: any) => {
        if(result.message == 'Deletado')
        {
          this.toastr.success('O evento foi deletado com sucesso', 'Deletado');
          this.CarregarEventos();
        }
      },
      (error: any) => {
        console.log(error);
        this.toastr.error(`Erro ao tentar deletar o evento ${this.eventoId}`,'Erro');
      },
    ).add(() => this.spinner.hide());
  }

  decline(): void {
    this.modalRef.hide();
  }

  detalheEvento(id: number): void{
    this.router.navigate([`eventos/detalhe/${id}`]);
  }
}
