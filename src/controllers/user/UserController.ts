import { Body, Controller, Delete, Get, HttpStatus, Post, Put, Query, Request, Res, UseGuards } from "@nestjs/common";
import { UserService } from "src/services/UserService";
import { FindUserDto } from "../dto/FindUserDto";
import { UserGuard } from "src/guards/UserGuard";
import { UserDto } from "../dto/UserDto";
import { Response } from "express";
import { CustomException } from "src/utils/Errors/CustomException";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get("find")
    @UseGuards(UserGuard)
    async find(@Query() findUserDto: FindUserDto, @Request() request) {
        const user = await this.userService.findByEmail(findUserDto.email ?? request.user?.email);
        if (!user) {
            throw new CustomException(`User ${findUserDto.email} not exists`, HttpStatus.NOT_FOUND);
        } else {
            return { userFound: true };
        }
    }

    @Post("register")
    @UseGuards(UserGuard)
    async register(@Body() userDto: UserDto) {
        return await this.userService.registerUser(userDto);
    }

    @Put("update")
    @UseGuards(UserGuard)
    async update(@Body() userDto: UserDto, @Res() res: Response) {
        const serviceResponse = await this.userService.updateUser(userDto);
        res.status(serviceResponse.code).json({ status: serviceResponse.status, message: serviceResponse.message });
        return;
    }

    @Delete("delete")
    @UseGuards(UserGuard)
    async delete(@Body() findUserDto: FindUserDto, @Res() res: Response) {
        const serviceResponse = await this.userService.deleteUser(findUserDto.email);
        res.status(serviceResponse.code).json({ status: serviceResponse.status, message: serviceResponse.message });
        return;
    }
}
