import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchfilter'
})

@Injectable()
export class SearchFilterPipe implements PipeTransform {
    transform(items: any[], term): any {
        return term
            ? items.filter(item => item.text.toLowerCase().indexOf(term) !== -1)
            : items;
    }
}