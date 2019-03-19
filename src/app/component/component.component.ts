import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-component',
    template: `
    <p>
      component works!
    </p>
  `,
    styles: []
})
export class ComponentComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }

}
