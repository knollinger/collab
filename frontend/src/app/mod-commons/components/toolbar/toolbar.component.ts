import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  standalone: false
})
export class ToolbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

@Component({
  selector: 'app-toolbar-separator',
  templateUrl: './toolbar-separator.component.html',
  styleUrls: ['./toolbar-separator.component.css'],
  standalone: false
})
export class ToolbarSeparatorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

