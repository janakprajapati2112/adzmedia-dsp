import {
    Subject
} from 'rxjs';
import {
    Component,
    OnInit,
    ViewEncapsulation,
    AfterViewInit,
    Input,
    Output,
    ComponentFactoryResolver,
    ViewChild,
    ViewContainerRef,
    Directive,
    Inject,
    QueryList,
    ViewChildren,
    Injectable,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';

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


@Injectable()
@Component({
    selector: 'dynamic-component',
    template: `
     <div class="snippet" *ngIf="reportLoading === true">
            <div class="stage">
              <div class="dot-typing"></div>
            </div>
          </div>

    <ng-container *ngFor="let rData of splitByData; let i = index; last as isLast">
    <div class="row report-row" >
            <div class="col-4"  [ngStyle]="{'padding-left': calculateTextPadding(nextSplit.id), 'word-break': 'break-all' }">
                <button 
                     class="btn report-btn-sm" 
                     *ngIf="checkIfHaveMoreSplits(nextSplit.id,splitOptions) !== 0 && rData.isCollapsed == true"
                     (click)="splitData(rowWiseFilterObj(rData,nextSplit.id,selectedRow),nextSplit.id,selectedFilters,splitOptions,i,rData,selectedDate,1,20)">+</button>

                <button 
           class="btn report-btn-sm" 
           *ngIf="checkIfHaveMoreSplits(nextSplit.id,splitOptions) !== 0 && rData.isCollapsed == false" 
           (click)="removeDynamicComponent(rData,i,selectedRow,nextSplit.id)"
           >-</button>
          <span *ngIf="nextSplit.id !== '__time'">{{rData[nextSplit.id]}}</span>
          <span *ngIf="nextSplit.id === '__time'">{{ rData[nextSplit.id]  | date:'dd-MM-yyyy HH:mm:ss Z'}}</span>
            </div>
            <div class="col-2">{{convertToDecimals(rData.impressions,2)}}</div>
            <div class="col-2">{{convertToDecimals(rData.conversions,2)}}</div>
            <div class="col-1">{{convertToDecimals(rData.bids,2)}}</div>
            <div class="col-1">{{convertToDecimals(rData.wins,2)}}</div>
            <div class="col-1">{{convertToDecimals(rData.spend,2)}}</div>
            <div class="col-1 text-center"> 
                <button class="btn btn-secondary m-btn m-btn--label-danger m-btn--label-danger m-btn--bolder m-btn--uppercase btn-sm" *ngIf="rData.isCollapsed===true"> <i class="la la-close"></i> </button>
        <button class="btn btn-secondary m-btn m-btn--label-danger m-btn--bolder m-btn--uppercase btn-sm" disabled="disabled" *ngIf="rData.isCollapsed===false"> <i class="la la-ban"></i> </button>

        </div>
            
    </div>
        <div *ngIf="isLast" class="text-right col-12">{{altrows("#ffffff","#f5f5f5")}}

            <a href="javascript:void(0)" class="m-link" (click)="loadmore(selectedRow,nextSplit.id,selectedFilters,splitOptions,rData,selectedDate,splitByData)" style="    margin: 10px -30px 15px 10px;
    background: #5ccdde;
    color: #fff;
    padding: 2px 10px;
    font-size: 12px;" *ngIf="splitByData.length > 19"> Load more </a>
        </div>
        <ng-template #dynamic ></ng-template>
    </ng-container>`
})
export class DynamicComponent implements OnInit, AfterViewInit {
    @Input() selectedRow: any;
    @Input() nextSplit: any;
    @Input() selectedFilters: any;
    @Input() splitOptions: any;
    @Input() splitByData: any;
    @Input() rowData: any;
    @Input() reportLoading: any;
    @Input() selectedDate: any;
    factoryResolver;
    rootViewContainer;

    @ViewChildren('dynamic', {
        read: ViewContainerRef
    }) viewContainerRef: QueryList<ViewContainerRef>

    constructor(
        @Inject(ComponentFactoryResolver) factoryResolver,
        private _apis: ApplicationApiService,
        private cd: ChangeDetectorRef
    ) {
        this.factoryResolver = factoryResolver
    }

    ngOnInit() {

    }

    ngAfterViewInit() {

    }

    setRootViewContainerRef(viewContainerRef) {
        this.rootViewContainer = viewContainerRef
    }

    addDynamicComponent(selectedRow, nextSplit, selectedFilters, splitOptions, sRow, selectedDate, page, limit) {
        const factory = this.factoryResolver
            .resolveComponentFactory(DynamicComponent)

        const component = factory
            .create(this.rootViewContainer.parentInjector)


        component.instance.selectedRow = selectedRow;
        component.instance.nextSplit = nextSplit;
        component.instance.selectedFilters = selectedFilters;
        component.instance.splitOptions = splitOptions;
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

        this._apis.getReportData(nextSplit.id, this.getApiFilters(result), selectedDate, page, limit).subscribe(response => {
            if (response.status == 1200) {

                response.data.split_by_data.map(function(obj) {
                    obj.isCollapsed = true;
                    return obj;
                });

                sRow.isCollapsed = false;
                component.instance.splitByData = response.data.split_by_data;
                this.reportLoading = false;

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


    checkIfHaveMoreSplits(c, splitOptions) {
        if (splitOptions.length > 0) {
            var index = splitOptions.findIndex(function(v) {
                return v.id == c
            })

            if (typeof (splitOptions[index + 1]) != "undefined") {
                return splitOptions[index + 1];
            } else {
                return 0;
            }
        }

    }

    splitData(obj, cSplit, sFilters, splitOptions, index, sRow, selectedDate, page, limit) {
        var nextSplit = this.checkIfHaveMoreSplits(cSplit, splitOptions);
        this.setRootViewContainerRef(this.viewContainerRef.toArray()[index]);
        this.addDynamicComponent(obj, nextSplit, sFilters, splitOptions, sRow, selectedDate, page, limit);
    }

    rowWiseFilterObj(row, split, prev) {

        if (prev.length == 0) {
            var arr = [];
            var obj = {
                id: split,
                label: split,
                values: [row[split]]
            }
            arr.push(obj);

            return arr;

        } else {
            var obj = {
                id: split,
                label: split,
                values: [row[split]]
            }
            prev.push(obj);
            return prev

        }
    }

    removeDynamicComponent(rowData, index, sFilters, nextSplit) {


        this.viewContainerRef.toArray()[index].clear();
        rowData.isCollapsed = true;
        this.altrows("#ffffff", "#f5f5f5");

        var index = sFilters.findIndex(function(o) {
            return o.id === nextSplit;
        })
        if (index !== -1) {
            sFilters.splice(index, 1);
        }

    }

    convertToDecimals(input, decimals) {
        var exp, rounded,
            suffixes = ['K', 'M', 'B', 'T', 'P', 'E'];


        if (input < 1000) {
            return parseFloat(input).toFixed(2);;
        }

        exp = Math.floor(Math.log(input) / Math.log(1000));

        return (input / Math.pow(1000, exp)).toFixed(decimals) + suffixes[exp - 1];
    }

    calculateTextPadding(id) {
        var index = this.splitOptions.findIndex(function(v) {
            return v.id == id
        })

        if (typeof (index) != "undefined") {
            return index * 40 + "px"
        } else {
            return "0px";
        }
    }

    altrows(firstcolor, secondcolor) {
        var tableElements = document.getElementsByClassName("report-row");
        for (var j = 0; j < tableElements.length; j++) {
            if (j % 2 == 0) {
                (tableElements[j]).className = "row report-row odd";
            }
            else {
                (tableElements[j]).className = "row report-row even";
            }

        }
    }

    loadmore(selectedRow, nextSplit, selectedFilters, splitOptions, sRow, selectedDate, splitByData) {

        var page = (splitByData.length / 20) + 1;
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
        console.log(result);

        this.reportLoading = true;

        var apiFilters = this.getApiFilters(result);
        delete apiFilters[nextSplit];



        this._apis.getReportData(nextSplit, apiFilters, selectedDate, page, 20).subscribe(response => {
            if (response.status == 1200) {

                response.data.split_by_data.map(function(obj) {
                    obj.isCollapsed = true;
                    return obj;
                });
                sRow.isCollapsed = false;
                if (response.data.split_by_data.length > 0) {

                    for (var i = 0; i < response.data.split_by_data.length; i++) {

                        splitByData.push(response.data.split_by_data[i])
                    }
                }

                this.reportLoading = false;

            }
        })
    }
}