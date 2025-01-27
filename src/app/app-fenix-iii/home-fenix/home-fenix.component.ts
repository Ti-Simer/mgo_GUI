import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/fenix-services/data.service';
import { UserService } from 'src/app/services/fenix-services/user.service';

@Component({
  selector: 'app-home-fenix',
  templateUrl: './home-fenix.component.html',
  styleUrls: ['./home-fenix.component.scss']
})
export class HomeFenixComponent {

  userId: any;
  user: any;
  flag: boolean = false;

  constructor(
    private authservice: AuthService,
    private userService: UserService,
    private dataService: DataService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.authservice.FenixKeyVerify();
    this.userId = this.authservice.getTokenData();

    this.validateData();
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.userService.findUserById(this.userId.userId).subscribe(
      response => {
        if (response.statusCode == 200) {
          this.user = response.data;
        }
      }, (error) => {
        console.log(error);
      }
    );
  }

  validateData() {
    this.dataService.verifyData().subscribe(
      response => {
        if (response.statusCode == 200) {
          this.flag = response.data;

          if (this.flag === true) {
            this.toastr.warning('Su periodo de prueba ha terminado  <a href="https://wa.me/+573045952650">Contacto</a>', 'Prueba vencida', {
              timeOut: 5000,
              progressBar: true,
              progressAnimation: 'increasing',
              closeButton: true,
              enableHtml: true
            });
          } 
        }
      }, (error) => {
        console.log(error);
      }
    );
  }

  toGeneralReport() {
    this.router.navigate(['/fenix/general-report']);
  }

}
