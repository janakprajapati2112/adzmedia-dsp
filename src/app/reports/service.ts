import {
    ComponentFactoryResolver,
    Injectable,
    Inject,
    ReflectiveInjector
} from '@angular/core'

import {
    Http,
    RequestMethod,
    RequestOptions,
    Response,
    ResponseOptions,
    XHRBackend,
    Headers
} from "@angular/http";
import {
    Observable
} from 'rxjs';
import {
    delay,
    map
} from 'rxjs/operators';
import 'rxjs/Rx';
import {
    ApplicationApiService
} from '../_services/api.service';

import {
    DynamicComponent
} from './dynamic.component'
@Injectable()


export class Service {
    factoryResolver;
    rootViewContainer;
    reportLoading: boolean = false;

    constructor(
        @Inject(ComponentFactoryResolver) factoryResolver,
        private _apis: ApplicationApiService,

    ) {
        this.factoryResolver = factoryResolver
    }
    setRootViewContainerRef(viewContainerRef) {
        this.rootViewContainer = viewContainerRef
    }
    addDynamicComponent(selectedRow, nextSplit, selectedFilters, splitOptions, rowData, selectedDate) {
        const factory = this.factoryResolver
            .resolveComponentFactory(DynamicComponent)

        const component = factory
            .create(this.rootViewContainer.parentInjector)

        component.instance.selectedRow = selectedRow;
        component.instance.nextSplit = nextSplit;
        component.instance.selectedFilters = selectedFilters;
        component.instance.splitOptions = splitOptions;
        component.instance.rowData = rowData;
        component.instance.reportLoading = true;
        component.instance.selectedDate = selectedDate;

        var a = JSON.parse(JSON.stringify(selectedFilters));
        var b = JSON.parse(JSON.stringify(selectedRow));


        a.filter(function(o1) {
            return b.some(function(o2) {
                if (o1.id === o2.id) {
                    o1.values = o2.values;
                }
            });
        });

        //Find values that are in result1 but not in result2
        var uniqueResultOne = a.filter(function(obj) {
            return !b.some(function(obj2) {
                return obj.id == obj2.id;
            });
        });

        //Find values that are in result2 but not in result1
        var uniqueResultTwo = b.filter(function(obj) {
            return !a.some(function(obj2) {
                return obj.id == obj2.id;
            });
        });

        //Combine the two arrays of unique entries
        var result = a.concat(uniqueResultOne.concat(uniqueResultTwo));
        result = result.filter((s1, pos, arr) => arr.findIndex((s2) => s2.id === s1.id) === pos);

        this.reportLoading = true;

        this._apis.getReportData(nextSplit.id, this.getApiFilters(result), selectedDate, 1, 20).subscribe(response => {
            if (response.status == 1200) {

                response.data.split_by_data.map(function(obj) {
                    obj.isCollapsed = true;
                    return obj;
                })

                component.instance.splitByData = response.data.split_by_data;
                component.instance.selectedDate = selectedDate;
                component.instance.reportLoading = false;
                rowData.isCollapsed = false;
            }
        })

        this.rootViewContainer.insert(component.hostView)
    }



    getApiFilters(selectedFilters) {
        var apiFilters: any = [{}];
        for (var i = 0; i < selectedFilters.length; i++) {
            if (selectedFilters[i].values.length > 0) {
                var k;
                k = selectedFilters[i].id
                apiFilters[0][k] = selectedFilters[i].values
            }
        }
        return apiFilters[0];
    }


}