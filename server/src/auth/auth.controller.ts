import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Patch, Post, Put, UseGuards } from '@nestjs/common';

import { User } from '@/decorators/user.decorator';
import { User as UserEntity } from '@/users/entities/user.entity';

import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateCountDto } from './dto/update-count.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local.guard';
import { Console } from 'console';

import { stripe } from '../../lib/stripe';
import { async } from 'node-stream-zip';

const secret_key_for_payments:string = process.env.SECRET_KEY_FOR_PAYMENTS!;


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  authenticate(@User() user: UserEntity) {
    console.log(user, "im in auth controller get method")
    return user;
  }

  @Post('google')
  async loginWithGoogle(@Body('credential') credential: string) {
    try {
      const user = await this.authService.authenticateWithGoogle(credential);
      const accessToken = this.authService.getAccessToken(user.id);

      return { user, accessToken };
    } catch (error) {
      throw new BadRequestException('User with this email might already exist.');
    }
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    const accessToken = this.authService.getAccessToken(user.id);

    return { user, accessToken };
  }


  @Post('knowcustomer')
  async knowcustomer(@Body() id:number){
    console.log("im in knowcustomer", id['id'])
    const isSubscriber = await this.authService.knowuser(id['id'])
    console.log(isSubscriber)
    return isSubscriber
  }
  

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() user: UserEntity) {
    const accessToken = this.authService.getAccessToken(user.id);

    return { user, accessToken };
  }

//login with clerk

@HttpCode(200)
@Post('clerklogin')
async clerklogin(@Body() newUserObject: object){
  console.log( newUserObject['name'],
  newUserObject['username'])

  try {
    const user = await this.authService.authenticateWithClerk(newUserObject);
    const accessToken = this.authService.getAccessToken(user.id);
    // const accessToken = 'this is accessToken'
    
    return { user,accessToken };
  } catch (error) {
    throw new BadRequestException('User with this email might already exist.');
  }
}








//payment done from stripe
@HttpCode(200)
@Post('payment_done_stripe')
async paymentdone( @Body() paid_obj:object){
  if(paid_obj['secret_key_for_payments']===secret_key_for_payments){
    console.log("im in payment_done_stripe", paid_obj)
    console.log("in in stripe controller",paid_obj['metadata']['userId'])
    this.authService.updateSubscriber(paid_obj['metadata']['userId'])
  }

  // try {
  //   const user = await this.authService.authenticateWithClerk(newUserObject);
  //   const accessToken = this.authService.getAccessToken(user.id);

  //   return { user, accessToken };
  // } catch (error) {
  //   throw new BadRequestException('User with this email might already exist.');
  // }
}



  @HttpCode(200)
  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @HttpCode(200)
  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  // @HttpCode(200)
  // // @UseGuards(JwtAuthGuard)
  // @Patch('update-profile')
  // updateProfile(@User('id') userId: number, @Body() updateProfileDto: UpdateProfileDto) {
  //   return this.authService.updateProfile(userId, updateProfileDto);
  // }
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Patch('update-profile')
  updateCount(@User('id') userId: number, @Body() updateProfileDto: UpdateProfileDto) {
    console.log(userId)
    return this.authService.updateCount(userId,updateProfileDto)
  }
 
 
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Get('stripe')
 async stripe(@User() user: UserEntity){
    console.log("im in stripe auth controller")
    // console.log(userId)
    console.log(user.email, "im in stripe", user.id)
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: 'http://localhost:3000/dashboard?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/dashboard',
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "Genius Pro",
              description: "Unlimited CV Generations"
            },
            unit_amount: 5000,
            recurring: {
              interval: "month"
            }
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId:user.id,
        userMail:user.email
      },
    })
    console.log("userId, im in stripe controller",stripeSession.metadata.userId)
    return JSON.stringify({ url: (stripeSession.url) })
  } catch (error) {
    console.log("[STRIPE_ERROR]", error);
    return ({ status: 500 });
  }

  
 
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Delete()
  async remove(@User('id') id: number) {
    await this.authService.removeUser(id);
  }
}
