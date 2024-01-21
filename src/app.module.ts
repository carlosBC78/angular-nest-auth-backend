import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';




@Module({
  imports: [
    ConfigModule.forRoot(),

    // MongooseModule.forRoot('mongodb://localhost:27017'),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME
    }),

    AuthModule,    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  
  // constructor(){
  //   console.log(process.env);//MONGO_URI: 'mongodb://localhost:27017', bbdd a conectar
  // }

}