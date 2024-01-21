import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {

    //los datos que necesitamos para crear un usuario
    //usar los decoradores del paquete instalado class-validator

    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @MinLength(6)
    password: string;
}
