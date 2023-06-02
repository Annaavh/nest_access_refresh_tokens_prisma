import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AtGuard, RtGuard } from 'src/common/decorators/guards';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from 'src/common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public() //qani vor global guard eink drel app.module um vor login exac user nayi , ays field eri vra el er azdum
  //hetevabar sarqecink @Public() decorator vor iranc vra chazdi
  @Post('local/signup')
  signupLocal(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signupLocal(dto);
  }

  @Public()
  @Post('local/signin')
  signinLocal(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signinLocal(dto);
  }

  // @UseGuards(AuthGuard('jwt'))
  // @UseGuards(AtGuard)
  @Post('logout')
  logout(
    //@Req() req: Request
    @GetCurrentUserId() userId: number,
  ): Promise<boolean> {
    // const user = req.user;
    return this.authService.logout(userId);
  }

  // @UseGuards(AuthGuard('jwt-refresh'))
  @Public()
  //qani vor AtGuard ne global @Public() grecink vor AtGuard n ancni nayi ira grac guard in
  @UseGuards(RtGuard)
  @Post('refresh')
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
