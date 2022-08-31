import { Component, OnInit } from '@angular/core';
import { catchError, retry, switchMap, tap } from "rxjs/operators";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country } from '../../interfaces/country.interface';
import { CountriesService } from '../../services/countries.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html'
})
export class SelectorPageComponent implements OnInit {

  form: FormGroup = this.fb.group({
    region: ['', [Validators.required]],
    country: ['', [Validators.required]],
    neighboringCountry: ['', [Validators.required]]
  });

  regions: string[] = [];
  countries: Country[] = [];
  neighboringCountries: Country[] = [];

  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService
  ) { }

  ngOnInit(): void {
    this.regions = this.countriesService.regions;

    this.form.get('region')?.valueChanges
      .pipe(
        tap((_) => {
          this.form.get('country')?.reset('');
          this.countries = [];
          this.loading = true;
          console.log('Ha cambiado', this.loading)
        }),
        switchMap(region => {
          return this.countriesService.getCountriesByRegion(region)
        }),
        catchError(() => {
          return of([])
        })
      )
      .subscribe(countries => {
        console.log('Subscription')
        this.loading = false;
        this.countries = countries;
      }, error => {
        this.loading = false;
        alert('Error al realizar la petición. Intentelo más tarde.');
      });

    this.form.get('country')?.valueChanges
      .pipe(
        tap((_) => {
          this.form.get('neighboringCountry')?.reset('');
          this.neighboringCountries = [];
          this.loading = true;
        }),
        switchMap((code) =>
          this.countriesService.getCountriesByCode(code)
        ),
        switchMap(country =>
          this.countriesService.getNeighboringCountriesByCodes(country?.borders!)
        ),
        catchError(() => {
          alert('Error al realizar la petición. Intentelo más tarde.');
          return of([])
        })
      )
      .subscribe((countries) => {
        this.loading = false;
        this.neighboringCountries = countries || [];
      }, error => {
        this.loading = false;
        alert('Error al realizar la petición. Intentelo más tarde.');
      });
  }

  exampleA() {
    let c: number[] = [0, 6, 3, 9, 2, 11, 2, 91, 48, 66, 1];

    console.log('Inicio');
    console.log([...c]);

    c[7] = c[4] + c[2]; // 2 + 3 = 5
    console.log('1');
    console.log([...c]);

    c[6] = c[7] + c[c[6]]; // 5 + c[2] = 5 + 3 = 8 
    console.log('2');
    console.log([...c]);

    c[5] = c[6] * c[1]; // 8 * 6 = 48
    console.log('3');
    console.log([...c]);

    console.log('Fin');
    console.log(c[5]);
  }

  // exampleB() {
  //   let c: number[] = [0, 3, 7, 2, 1, 5, 12, 4, 0];

  //   console.log('Inicio')
  //   console.log([...c]);

  //   c[1] = c[8]; // 0
  //   console.log('1')
  //   console.log([...c])

  //   while (true) {
  //     // c[1] = c[1] + c[2]; // 0 + 7 = 7
  //     console.log('2')
  //     console.log([...c])

  //     c[1] = c[1] + c[3];
  //     console.log('3')
  //     console.log([...c])



  //     console.log('4');
  //     const comparacion = c[2] > c[7];
  //     console.log(comparacion);
  //     console.log([...c]);

  //     if (comparacion) {
  //       break;
  //     }

  //   }


  //   console.log('Fin');
  //   console.log(c[1]);
  // }


  function1() {
    let c: number[] = [0, 2, 3, 1, 5, 7, 6, 21, 7, 11, 9, 0, 2];

    console.log('Inicio')
    console.log([...c])

    c[11] = c[3] + c[11];
    console.log('1')
    console.log([...c])

    c[5] = c[1] + c[c[9]];
    console.log('2')
    console.log([...c])

    while (true) {
      c[12] = c[12] * c[12];
      console.log('3')
      console.log([...c])

      console.log('4');
      const comparacion = c[5] == c[10];
      console.log(comparacion);
      console.log([...c]);

      if (comparacion) {

        c[8] = c[7] - c[5];
        console.log('7')
        console.log([...c])

        c[6] = c[12] + c[8]
        console.log('8')
        console.log([...c])
        break;
      };

      c[12] = c[12] - 2;
      console.log('5');
      console.log([...c]);

      c[5] = c[2] + c[5];
      console.log('6');
      console.log([...c]);

    }

    console.log('Fin');
    console.log(c[6]);

  }


  save() {
    console.log('Logica de guardando...')
    console.log(this.form.value);
  }



}
