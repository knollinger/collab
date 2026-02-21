import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  standalone: false
})
export class ToolbarComponent {

  constructor() { }
}

@Component({
  selector: 'app-toolbar-separator',
  templateUrl: './toolbar-separator.component.html',
  styleUrls: ['./toolbar-separator.component.css'],
  standalone: false
})
export class ToolbarSeparatorComponent {

  constructor() { }
}

@Component({
  selector: 'app-toolbar-filler',
  templateUrl: './toolbar-filler.component.html',
  styleUrls: ['./toolbar-filler.component.css'],
  standalone: false
})
export class ToolbarFillerComponent {

  constructor() { }
}

