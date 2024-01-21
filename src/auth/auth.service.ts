import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcryptjs from 'bcryptjs'

// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
// import { LoginDto } from './dto/login.dto';
import { RegisterUserDto, CreateUserDto, UpdateAuthDto, LoginDto } from './dto';

import { User } from './entities/user.entity';

import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';




@Injectable()
export class AuthService {


  constructor(
    @InjectModel(User.name) 
    private userModel: Model<User>,
    private jwtService: JwtService
  ){}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // console.log(createUserDto);
    // return 'This action adds a new auth';

    // const newUser = new this.userModel(createUserDto);

    // return newUser.save();//grabar el usuario

    try{

      //hacer ésto antes de guardar el usuario
      //1-Encriptar la contraseña
      const {password, ...userData} = createUserDto;

      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 10),
        ...userData
      });
      console.log(newUser);


      //2-guardar el usuario

      //3-generar el jwt (json web token)

      await newUser.save();//grabar el usuario

      //no deseamos mandar la contraseña al usuario de vuelta
      const {password:_, ...user} = newUser.toJSON()
      return user; 

    } catch(error){
      // console.log(error.code);//error 11000 llave duplicada
      if(error.code === 11000){
        throw new BadRequestException(`${createUserDto.email} already exists!`);
      }
      throw new InternalServerErrorException('Something terrible happen!!!');
    }

  }

  async register(registerDto: RegisterUserDto): Promise<LoginResponse>{

    const user = await this.create(registerDto);//el dto cumple el objeto que necesito

    console.log({user});
    return {
      user: user,
      token: this.getJwtToken({id: user._id})
    }
  }


  async login(loginDto: LoginDto) : Promise<LoginResponse>{

    /**
     * User {_id, name, email, roles, ...}
     * Token => jdklafjsdkañfjsl.adfafsddasf.fdasfsfds
     */

    // console.log({loginDto});

    const {email, password} = loginDto;

    const user = await this.userModel.findOne({email: email});

    //VERIFICAR EL EMAIL
    if( !user ){
      throw new UnauthorizedException('Not valid credentials - email');
    }

    //VERIFICAR LA CONTRASEÑA
    if(!bcryptjs.compareSync(password, user.password)){
      throw new UnauthorizedException('Not valid credentials - password');
    }

    // return 'TODO BIEN!';

    //respuesta del servicio
    //no deseamos mandar la contraseña al usuario de vuelta
    const {password: _, ...rest} = user.toJSON();

    return {
      user: rest,
      // token: 'ABC-123' ///generar el jwt
      token: this.getJwtToken({id: user.id})
    }
  }

  findAll(): Promise<User[]>{
    return this.userModel.find();//retorna todos los usuarios, ¿¿paginación?? ¿curso nest?
    // return `This action returns all auth`;
  }

  async findUserById(id: string){
    const user = await this.userModel.findById(id);
    const {password, ...rest} = user.toJSON();
    return rest; //devuelvo todo menos la password
  }
  

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }


  //firma del jwt
  getJwtToken(payload: JwtPayload){

    const token = this.jwtService.sign(payload);
    return token;

  }
}
