import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CharacterDto {
  @Field()
  @IsNotEmpty()
  name: string;
  @Field({ nullable: true })
  planet?: string;
  @Field(() => [String])
  episodes: string[];
}
