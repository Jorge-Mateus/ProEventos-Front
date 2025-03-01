import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  //animação para o botão do navbar
  isCollapsed = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  showMenu(): boolean{
    return this.router.url != '/user/login';
  }

}
