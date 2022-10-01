import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {

  constructor() { }


  ngOnInit(): void {
    // this.location = this.route.snapshot.data['data'] ? this.route.snapshot.data['data'].location : null;
    // this.mode = !this.location ? 'create' : 'edit';

    // console.log(this.romania);

    // this.offersForm = this.fb.group({
    //   oferte: this.fb.array(this.location && this.location.oferte && this.location.oferte.length ? this.location.oferte.map(item => this.createOferta(item)) : []),
    // });

    // this.locationsForm.valueChanges.subscribe(val => {
    //   console.log(val);
    // })


    // this.romania = this.locationsForm.get('localitate').valueChanges
    //   .pipe(
    //     filter(res => {
    //       return res !== null && res.length
    //     }),
    //     distinctUntilChanged(),
    //     debounceTime(250),
    //     tap(() => {
    //       this.isLoading = true;
    //     }),
    //     switchMap(value => this.locationsService.getRomanianLocations(value)
    //       .pipe(
    //         finalize(() => {
    //           this.isLoading = false
    //         }),
    //       )
    //     )
    //   )
  }

  // oferte
  // createOferta(oferta) {
  //   return this.fb.group({
  //     nume: oferta.nume || null,
  //     pret: oferta.pret || null,
  //     status: oferta.status ? oferta.status : false
  //   });
  // }

  // addOferta() {
  //   const group = this.fb.group({
  //     nume: new FormControl(null, [Validators.required]),
  //     pret: new FormControl(null),
  //     status: new FormControl(false),
  //   })

  //   const oferteArray = this.locationsForm.get('oferte') as FormArray;
  //   oferteArray.push(group);
  // }

  // removeOferta(index) {
  //   let oferteArray = this.locationsForm.get('oferte') as FormArray;
  //   oferteArray.removeAt(index);
  // }

  // get oferte(): FormArray {
  //   return this.locationsForm.get('oferte') as FormArray;
  // }
}
