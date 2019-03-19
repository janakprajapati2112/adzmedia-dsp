import { Injectable } from "@angular/core";
import { Http, RequestMethod, RequestOptions, Response, ResponseOptions, XHRBackend, Headers } from "@angular/http";
import 'rxjs/Rx';
import { Creatives } from '../domain/creatives';
@Injectable()
export class UploadCreativeService {

    constructor(private http: Http) {

    }

    uploadBannerCreative(data, options) {

        return this.http.post('http://ripul.dsp.local/api/campaign/upload-image', (data), options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    uploadRichMediaCreative(data, options) {
        return this.http.post('http://ripul.dsp.local/api/campaign/upload-rich-media', (data), options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    uploadNativeCreative(data, options) {
        return this.http.post('http://ripul.dsp.local/api/campaign/upload-native-creative', (data), options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    uploadBannerCreativeEdit(data, options) {

        return this.http.post('http://ripul.dsp.local/api/campaign/update-image', (data), options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    uploadRichMediaCreativeEdit(data, options) {
        return this.http.post('http://ripul.dsp.local/api/campaign/update-rich-media', (data), options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    uploadNativeCreativeEdit(data, options) {
        return this.http.post('http://ripul.dsp.local/api/campaign/update-native-creative', (data), options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    getCreatives(data, options) {
        return this.http.post('http://ripul.dsp.local/api/campaign/get-user-creatives', data, options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    getCreativesData(data, options) {
        return this.http.post('http://ripul.dsp.local/api/campaign/edit-user-creative', data, options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }

    deleteCreative(data, options) {
        return this.http.post('http://ripul.dsp.local/api/campaign/delete-user-creative', data, options)
            .map((response: Response) => {
                let res = response.json();
                return res;
            });
    }


}