import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { UsuarioModel } from "src/app/models/usuario.model";
import { AuthService } from "../../services/auth.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";

@Component({
  selector: "app-registro",
  templateUrl: "./registro.component.html",
  styleUrls: ["./registro.component.css"],
})
export class RegistroComponent implements OnInit {
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

  onSubmit(f: NgForm) {
    if (f.invalid) {
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      icon: "info",
      text: "Espere por favor...",
    });
    Swal.showLoading();

    this.auth.nuevoUsuario(this.usuario).subscribe(
      (data) => {
        Swal.fire({
          allowOutsideClick: false,
          icon: "success",
          text: "Usuario creado con éxito",
          title: "Completado",
        });
        this.router.navigateByUrl("/home");
        if (this.recordarme) {
          localStorage.setItem("email", this.usuario.email);
        }
      },
      (err) => {
        console.log(err["error"].error.message);
        Swal.fire({
          icon: "error",
          text: "El usuario ya existe",
          title: "Error al Autenticar",
        });
      }
    );
  }
}
