import {Body, Controller, Post} from '@nestjs/common';
import { User, UserDocument } from '../schemas/user.schema';
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";

import {RegisterUserDto} from "./dto/register-user.dto";


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
}
