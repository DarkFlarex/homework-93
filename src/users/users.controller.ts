import {Body, Controller, Delete, Post, Req, UseGuards} from '@nestjs/common';
import { User, UserDocument } from '../schemas/user.schema';
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import { Request } from 'express';
import {AuthGuard} from "@nestjs/passport";
import {RegisterUserDto} from "./dto/register-user.dto";
import {TokenAuthGuard} from "../auth/token-auth.guard";

@Controller('users')
export class UsersController {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    @Post()
    async registerUser(@Body() registerUserDto: RegisterUserDto) {
        const user = new this.userModel({
            email: registerUserDto.email,
            password: registerUserDto.password,
            displayName: registerUserDto.displayName,
        });

        user.generateToken();

        return await user.save();
    }

    @UseGuards(AuthGuard('local'))
    @Post('sessions')
    async login(@Req() req: Request) {
        return req.user;
    }

    @UseGuards(TokenAuthGuard)
    @Delete('sessions')
    async logout(@Req() req: Request) {
        const user = req.user as UserDocument;
        user.generateToken();
        await user.save();

        return { message: `Logout in: ${user.email}` };
    }
}
