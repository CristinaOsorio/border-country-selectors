import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Country, CountryComplete } from '../interfaces/country.interface';
import { combineLatest, Observable, of } from 'rxjs';
import { map, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private baseUrl = 'https://restcountries.com/v3.1'
  private _regions: string[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  get regions() {
    return [...this._regions];
  }

  constructor(private http: HttpClient) { }

  getCountriesByRegion(region: string): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.baseUrl}/region/${region}?fields=name,cca2`)
      .pipe(retry(3));
  }

  getCountriesByCode(code: string): Observable<CountryComplete | null> {
    if (!code) return of(null)

    return this.http.get<CountryComplete[]>(`${this.baseUrl}/alpha/${code}`)
      .pipe(
        map(countries => countries[0]),
        retry(3)
      );
  }

  getCountryByCode(code: string): Observable<Country> {
    return this.http.get<Country>(`${this.baseUrl}/alpha/${code}?fields=name,cca2`)
      .pipe(
        retry(3)
      );
  }

  getNeighboringCountriesByCodes(neighboringCountriesCodes: string[]): Observable<Country[]> {
    if (!neighboringCountriesCodes) return of([]);

    const requests: Observable<Country>[] = [];

    neighboringCountriesCodes.forEach(neighboringCountryCode => {
      const request = this.getCountryByCode(neighboringCountryCode);
      requests.push(request)
    });

    return combineLatest(requests);
  }

}
