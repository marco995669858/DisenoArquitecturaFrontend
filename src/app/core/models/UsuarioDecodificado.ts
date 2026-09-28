export interface UsuarioDecodificado {
  sub: string;
  idUsuario: number;
  roles: Roles[];
  exp: number;
}


export interface Roles{
    authority:string;
}
