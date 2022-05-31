import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/user/entities/user.entity";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    imports: [
      UserModule,
      JwtModule.register({
        secret: 'secret',
        signOptions: { expiresIn: '1d' }
      }),
      TypeOrmModule.forFeature([UserEntity]),
      
    ],
    controllers: [AuthController],
    providers: [AuthService, UserService],
    exports: [],
  })
  export class AuthModule {}
