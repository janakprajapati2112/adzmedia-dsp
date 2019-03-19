import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-testapp',
    template: `
    <p>
      testapp works!
    </p>
  `,
    styles: []
})
export class TestappComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    }

}
