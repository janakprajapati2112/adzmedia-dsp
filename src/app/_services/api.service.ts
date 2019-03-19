import { Injectable } from "@angular/core";
import { Http, RequestMethod, RequestOptions, Response, ResponseOptions, XHRBackend, Headers } from "@angular/http";
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import 'rxjs/Rx';
import { Creatives } from '../creatives/domain/creatives';
import { ConfigService } from './config.service';
import * as moment from 'moment';

export interface Countries {
    id: string;
    text: string;
}
export interface Cities {
    id: string;
    text: string;
}
export interface Carriers {
    id: string;
    text: string;
}
export interface Manufacturer {
    id: string;
    text: string;
}
export interface Devices {
    id: string;
    text: string;
}

@Injectable()
export class ApplicationApiService {

    constructor(
        private http: Http,
        private _configService: ConfigService
    ) {

    }

    getCreatives(data, options) {
        return this.http.post(this._configService.getApiUrl() + 'api/campaign/get-user-creatives', data, options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    verify() {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this._configService.getApiUrl() + 'api/verify', options)
            .map((response: Response) => {
                let res = response.json();
                if (res.status != 1200) {
                    return false
                } else {
                    return res;
                }

            });
    }

    getCountries(term: string = null): Observable<Countries[]> {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });

        if (term != null || term != '') {
            return this.http.get(this._configService.getApiUrl() + 'api/data/countries?q=' + term, options)
                .map((response: Response) => {
                    let res = response.json();
                    return res.data;
                });
        }

    }

    getCities(term: string = null, country): Observable<Cities[]> {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });

        var countries = '';
        for (var i = 0; i < country.length; i++) {
            countries += country[i].id + ",";
        }
        countries = countries.substring(0, countries.length - 1);
        if (term != null || term != '') {
            return this.http.get(this._configService.getApiUrl() + 'api/data/cities?q=' + term + '&country=' + countries, options)
                .map((response: Response) => {
                    let res = response.json();
                    return res.data;
                });
        }
    }

    getOperators(term: string = null, country): Observable<Carriers[]> {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });

        var countries = '';
        for (var i = 0; i < country.length; i++) {
            countries += country[i].id + ",";
        }
        countries = countries.substring(0, countries.length - 1);

        if (term != null || term != '') {
            return this.http.get(this._configService.getApiUrl() + 'api/data/operators?q=' + term + '&country=' + countries, options)
                .map((response: Response) => {
                    let res = response.json();
                    return res.data;
                });
        }
    }

    getOperatingSystems(options) {
        return this.http.get(this._configService.getApiUrl() + 'api/data/op_systems', options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    getBrowsers(options) {
        return this.http.get(this._configService.getApiUrl() + 'api/data/browsers', options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    getCategories(options) {
        return this.http.get(this._configService.getApiUrl() + 'api/data/categories', options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    getTimeZone(options) {
        return this.http.get(this._configService.getApiUrl() + 'api/data/timezones', options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    getManufacturer(term: string = null): Observable<Manufacturer[]> {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this._configService.getApiUrl() + 'api/data/device-makers?q=' + term, options)
            .map((response: Response) => {
                let res = response.json();
                return res.data;
            });
    }

    getDevices(term: string = null): Observable<Devices[]> {

        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this._configService.getApiUrl() + 'api/data/devices?q=' + term, options)
            .map((response: Response) => {
                let res = response.json();
                return res.data;
            });
    }

    getOperatingSystemVersion(osid, options) {

        return this.http.get(this._configService.getApiUrl() + 'api/data/os_versions' + "?os=" + osid, options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    getExchanges(options) {
        return this.http.get(this._configService.getApiUrl() + 'api/data/exchanges', options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    getExchangeApps(options, filters, page, limit) {

        var url = '';
        if (typeof (filters) != "undefined") {
            url = this._configService.getApiUrl() + 'api/data/app-list?filters=' + encodeURIComponent(JSON.stringify(filters)) + '&page=' + page + '&limit=' + limit;
        }
        else {
            filters = [{}];
            url = this._configService.getApiUrl() + 'api/data/app-list?filters=' + encodeURIComponent(JSON.stringify(filters)) + '&page=' + page + '&limit=' + limit;
        }

        return this.http.get(url, options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    createAppList(data, options) {
        return this.http.post(this._configService.getApiUrl() + 'api/campaign/save-applist', data, options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    getExchangeOperatingSystemVersion(osid, options, filters) {

        var url = '';
        if (typeof (filters) != "undefined") {
            url = this._configService.getApiUrl() + 'api/data/inventory_osv?filters=' + encodeURIComponent(JSON.stringify(filters));
        }
        else {
            filters = [{}];
            url = this._configService.getApiUrl() + 'api/data/inventory_osv?filters=' + encodeURIComponent(JSON.stringify(filters));
        }



        return this.http.get(url, options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }


    getExchangeCountries(filters) {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });

        var url = '';

        if (typeof (filters) != "undefined") {
            url = this._configService.getApiUrl() + 'api/data/inventory_countries?filters=' + encodeURIComponent(JSON.stringify(filters));
        }
        else {
            filters = [{}];
            url = this._configService.getApiUrl() + 'api/data/inventory_countries?filters=' + encodeURIComponent(JSON.stringify(filters));
        }

        return this.http.get(url, options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });


    }

    getExchangeCarriers(cid, options, filters) {
        var url = '';

        if (typeof (filters) != "undefined") {
            url = this._configService.getApiUrl() + 'api/data/inventory_carriers?filters=' + encodeURIComponent(JSON.stringify(filters));
        }
        else {
            filters = [{}];
            url = this._configService.getApiUrl() + 'api/data/inventory_carriers?filters=' + encodeURIComponent(JSON.stringify(filters));
        }
        return this.http.get(url, options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    getExchangeOperatingSystems(options, filters) {
        var url = '';

        if (typeof (filters) != "undefined") {
            url = this._configService.getApiUrl() + 'api/data/inventory_os?filters=' + encodeURIComponent(JSON.stringify(filters));
        }
        else {
            filters = [{}];
            url = this._configService.getApiUrl() + 'api/data/inventory_os?filters=' + encodeURIComponent(JSON.stringify(filters));
        }
        return this.http.get(url, options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    getNetworkType(options, filters) {
        var url = '';

        if (typeof (filters) != "undefined") {
            url = this._configService.getApiUrl() + 'api/data/inventory_connections?filters=' + encodeURIComponent(JSON.stringify(filters));
        }
        else {
            filters = [{}];
            url = this._configService.getApiUrl() + 'api/data/inventory_connections?filters=' + encodeURIComponent(JSON.stringify(filters));
        }
        return this.http.get(url, options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    getCreativeSizes(options, filters) {

        var url = '';

        if (typeof (filters) != "undefined") {
            url = this._configService.getApiUrl() + 'api/data/inventory_creative_size_types?filters=' + encodeURIComponent(JSON.stringify(filters));
        }
        else {
            filters = [{}];
            url = this._configService.getApiUrl() + 'api/data/inventory_creative_size_types?filters=' + encodeURIComponent(JSON.stringify(filters));
        }
        return this.http.get(url, options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });

    }

    getUserAppList() {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this._configService.getApiUrl() + 'api/campaign/get-user-inventory', options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });

    }

    getUserSingleAppListData(id) {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this._configService.getApiUrl() + 'api/campaign/edit-applist/' + id, options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });

    }

    updateUserAppList(data, options) {
        return this.http.post(this._configService.getApiUrl() + 'api/campaign/update-applist', data, options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    checkUserApplistStatus(data) {

        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this._configService.getApiUrl() + 'api/campaign/check-list-usage?id=' + data, options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    deleteAppList(data) {

        var deletedid = {
            id: data
        }

        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this._configService.getApiUrl() + 'api/campaign/delete-inventory', deletedid, options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    getReportDimensions() {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this._configService.getApiUrl() + 'api/report/data/dimensions', options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });


    }


    getFilterDimentionValues(d, q, filter, date) {


        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });
        let startDate = moment(date.startDate).format('DD/MM/YYYY');
        let endDate = moment(date.endDate).format('DD/MM/YYYY');
        return this.http.get(this._configService.getApiUrl() + 'api/report/split-dimension?fromDate=' + startDate + '&toDate=' + endDate + '&limit=20&dimension=' + d + '&searchTxt=' + q + "&filters=" + encodeURIComponent(JSON.stringify(filter)), options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    getReportData(d, filter, date, page, limit) {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });
        let startDate = moment(date.startDate).format('DD/MM/YYYY');
        let endDate = moment(date.endDate).format('DD/MM/YYYY');
        return this.http.get(this._configService.getApiUrl() + 'api/report/split-dimension?report=1&fromDate=' + startDate + '&toDate=' + endDate + '&dimension=' + d + '&filters=' + encodeURIComponent(JSON.stringify(filter)) + "&page=" + page + "&limit=" + limit, options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    getReportGraph(d, filter, date) {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });
        let startDate = moment(date.startDate).format('DD/MM/YYYY');
        let endDate = moment(date.endDate).format('DD/MM/YYYY');
        return this.http.get(this._configService.getApiUrl() + 'api/report/graph?fromDate=' + startDate + '&toDate=' + endDate + '&graph=' + d + '&filters=' + encodeURIComponent(JSON.stringify(filter)), options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    loadCampaignList(data, options) {

        if (data.status == "999") {
            delete data.status;
        }

        return this.http.post(this._configService.getApiUrl() + 'api/campaign/list', data, options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }


    loadTransactionList(data, options) {
        return this.http.post(this._configService.getApiUrl() + 'api/transactions', data, options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    changePassword(data) {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._configService.getApiUrl() + 'api/change-password', data, options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    updateCampaign(data) {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._configService.getApiUrl() + 'api/campaign/status_update', data, options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    cloneCampaign(data) {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._configService.getApiUrl() + 'api/campaign/clone', data, options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    sendPayment(token, amount, email, amount1) {
        let headers = new Headers();
        var data = {
            stripeToken: token,
            amount: amount,
            email: email,
            amount2: amount1
        };
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this._configService.getApiUrl() + 'api/make-charge', data, options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    getInvoice(id) {

        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this._configService.getApiUrl() + 'api/invoice/' + id, options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    exportReportData(d, filter, date, page, limit) {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });
        let startDate = moment(date.startDate).format('DD/MM/YYYY');
        let endDate = moment(date.endDate).format('DD/MM/YYYY');
        return this.http.get(this._configService.getApiUrl() + 'api/report/split-dimension?report=1&fromDate=' + startDate + '&toDate=' + endDate + '&dimension=' + d + '&filters=' + encodeURIComponent(JSON.stringify(filter)) + "&page=" + page + "&limit=" + limit, options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }
}