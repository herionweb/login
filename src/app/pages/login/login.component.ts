import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { UsuarioModel } from "src/app/models/usuario.model";
import Swal from "sweetalert2";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  usuario: UsuarioModel;
  recordarme: boolean = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.usuario = new UsuarioModel();
    if (localStorage.getItem("email")) {
      this.usuario.email = localStorage.getItem("email");
      this.recordarme = true;
    }
  }

  login(f: NgForm) {
    if (f.invalid) {
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon: "info",
      text: "Espere por favor...",
    });
    Swal.showLoading();

    this.auth.login(this.usuario).subscribe(
      (data) => {
        Swal.close();
        this.router.navigateByUrl("/home");

        if (this.recordarme) {
          localStorage.setItem("email", this.usuario.email);
        }
      },
      (err) => {
        // console.log(err.error.error.message);
        Swal.fire({
          icon: "error",
          text: "Contraseña Incorrecta",
          title: "Error al Autenticar",
        });
      }
    );
  }
}
