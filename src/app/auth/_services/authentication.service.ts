
import { Injectable } from "@angular/core";
import { BaseRequestOptions, Http, RequestMethod, RequestOptions, Response, ResponseOptions, XHRBackend } from "@angular/http";
import "rxjs/add/operator/map";

@Injectable()
export class AuthenticationService {

    constructor(private http: Http) {
    }

    login(email: string, password: string) {
        return this.http.post('http://ripul.dsp.local/api/login', JSON.stringify({ email: email, password: password }))
            .map((response: Response) => {
                let res = response.json();
                if (res.success == true) {
                    if (res.data.token) {
                        localStorage.setItem('_token', JSON.stringify(res.data.token));
                        localStorage.setItem('uName', JSON.stringify(res.data.user.name));
                        localStorage.setItem('uEmail', JSON.stringify(res.data.user.email));
                        return res;
                    }

                }
                else {
                    return res;
                }
            });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('_token');
    }
}