export interface UsuarioDecodificado {
  sub: string;
  idEmpresa: number;
  tipoNegocio: string;
  roles: Roles[];
  exp: number;
}


export interface Roles{
    authority:string;
}
