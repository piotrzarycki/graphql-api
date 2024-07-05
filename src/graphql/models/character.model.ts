import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class Character {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => [String])
  episodes: string[];
}
