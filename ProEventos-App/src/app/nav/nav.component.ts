import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  //animação para o botão do navbar
  isCollapsed = true;

  constructor() { }

  ngOnInit() {
  }

}
