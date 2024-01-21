
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterUserDto {

    //usar los decoradores del paquete instalado class-validator
    //registrar un usuario puede solicitar más campos para registrar un usuario

    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @MinLength(6)
    password: string;
}
