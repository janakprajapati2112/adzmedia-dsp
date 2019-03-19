import { Injectable } from "@angular/core";
import { Http, RequestMethod, RequestOptions, Response, ResponseOptions, XHRBackend, Headers } from "@angular/http";
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import 'rxjs/Rx';
import { Creatives } from '../../creatives/domain/creatives';
import { ConfigService } from '../../_services/config.service';

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
export class CampaignOperationsService {

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

    getCountries(term: string = null): Observable<Countries[]> {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this._configService.getApiUrl() + 'api/data/countries?q=' + term, options)
            .map((response: Response) => {
                let res = response.json();
                return res.data;
            });
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

        return this.http.get(this._configService.getApiUrl() + 'api/data/cities?q=' + term + '&country=' + countries, options)
            .map((response: Response) => {
                let res = response.json();
                return res.data;
            });
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


        return this.http.get(this._configService.getApiUrl() + 'api/data/operators?q=' + term + '&country=' + countries, options)
            .map((response: Response) => {
                let res = response.json();
                return res.data;
            });
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

    uploadCampaign(data, options) {
        return this.http.post(this._configService.getApiUrl() + 'api/campaign/create', data, options)
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


    loadCampaignApplistData(listId) {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this._configService.getApiUrl() + 'api/campaign/get-apps-by-list?list=' + listId, options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });

    }

    updateAppBid(bids) {
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + JSON.parse(localStorage.getItem('_token')));
        let options = new RequestOptions({ headers: headers });

        return this.http.post(this._configService.getApiUrl() + 'api/campaign/save-microbid', bids, options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });

    }
}
