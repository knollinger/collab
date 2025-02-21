import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

@Component({
  selector: 'app-toolbar-separator',
  templateUrl: './toolbar-separator.component.html',
  styleUrls: ['./toolbar-separator.component.css']
})
export class ToolbarSeparatorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

