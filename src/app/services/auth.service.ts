import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UsuarioModel } from "../models/usuario.model";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  usuario: UsuarioModel;
  //crear nuevo usuario
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  // login
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  private url = "https://identitytoolkit.googleapis.com";
  private apiKey = "AIzaSyDyPu_cF34XX5GPkH74sxkoyEKnCo8NzWQ";
  token: string;

  constructor(private http: HttpClient) {
    this.cargarStorageToken();
  }

  login(usuario: UsuarioModel) {
    const nuevoUser = {
      ...usuario,
      returnSecureToken: true,
    };

    return this.http
      .post(
        `${this.url}/v1/accounts:signInWithPassword?key=${this.apiKey}`,
        nuevoUser
      )
      .pipe(
        map((resp) => {
          // console.log(resp);
          this.guardarStorageToken(resp["idToken"]);
        })
      );
  }

  logout() {
    localStorage.removeItem("token");
  }

  nuevoUsuario(usuario: UsuarioModel) {
    const nuevoUser = {
      // ...usuario  Se podría poner awsí también
      email: usuario.email,
      nombre: usuario.nombre,
      password: usuario.password,
      returnSecureToken: true,
    };

    return this.http
      .post(`${this.url}/v1/accounts:signUp?key=${this.apiKey}`, nuevoUser)
      .pipe(
        map((resp) => {
          // console.log(resp);
          this.guardarStorageToken(resp["idToken"]);
        })
      );
  }

  private guardarStorageToken(tokenId: string) {
    this.token = tokenId;
    localStorage.setItem("token", tokenId);

    //========= cuando expira el toke n=======
    let hoy = new Date();
    hoy.setSeconds(3600);
    localStorage.setItem("expira", hoy.getTime().toString());
    //=================================
  }

  private cargarStorageToken() {
    if (localStorage.getItem("token")) {
      this.token = localStorage.getItem("token");
    }
    return (this.token = "");
  }

  permitido(): boolean {
    if (this.token.length < 2) {
      return false;
    }
    const expira = Number(localStorage.getItem("expira"));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if (expiraDate > new Date()) {
      return true;
    } else {
      return false;
    }
  }
}
