import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ObservationUploadModel } from './models/observation-upload.model';
import { Observation } from './models/observation.model';
import { ApiResponseModel } from './models/api-response.model';
import { FoliageTimeSeriesModel } from './models/foliage-time-series.model';

@Injectable({
    providedIn: 'root'
})
export class ObservationService {

    constructor(
        private _httpClient: HttpClient
    ) { }

    public uploadObservationImage(file: File): Observable<boolean> {
        return this.getSecureS3UploadLink(file.type)
            .pipe(
                switchMap(observationUploadModel => {
                    file = new File([file], observationUploadModel.fileName, { type: file.type });
                    return this._httpClient.put(observationUploadModel.uploadUrl, file, { headers: { 'Content-Type': file.type } });
                }),
                map(() => true)
            );
    }

    private getSecureS3UploadLink(fileType: string): Observable<ObservationUploadModel> {
        const endpoint = `${environment.observatoryApiEndpoint}/observation?fileType=${fileType}`;
        return this._httpClient
            .get<ObservationUploadModel>(endpoint);
    }

    public getLatestObservation(): Observable<Observation> {
        const endpoint = `${environment.observatoryApiEndpoint}/observation/latest`;
        return this._httpClient
            .get<Observation>(endpoint);
    }

    public recordReaction(reactionType: string): Observable<ApiResponseModel> {
        const endpoint = `${environment.observatoryApiEndpoint}/reaction`;
        return this._httpClient
            .post<ApiResponseModel>(endpoint, { reaction_type: reactionType });
    }

    public getFoliageTimeSeries(): Observable<FoliageTimeSeriesModel[]> {
        const endpoint = `${environment.observatoryApiEndpoint}/observation/foliage`;
        return this._httpClient
            .get<FoliageTimeSeriesModel[]>(endpoint);
    }
}
