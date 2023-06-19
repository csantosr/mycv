import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Delete,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UserDTO } from './dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';

@Serialize(UserDTO)
@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDTO) {
    return this.authService.signup(body.email, body.password);
  }

  @Post('/signin')
  signin(@Body() body: CreateUserDTO) {
    return this.authService.signin(body.email, body.password);
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findUser(parseInt(id));

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO) {
    return this.usersService.update(parseInt(id), body);
  }
}
