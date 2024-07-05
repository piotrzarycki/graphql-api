import { Inject, Param } from '@nestjs/common';
import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { Character } from '../../graphql/models/character.model';
import { CharacterDto } from './dto/character.dto';
import { CharacterService } from './character.service';
import { FetchCharacterArgsDto } from './dto/fetch-character.dto';

@Resolver(() => Character)
export class CharacterResolver {
  constructor(@Inject() private readonly characterService: CharacterService) {}
  @Query(() => [Character])
  async characters(
    @Args('args') args: FetchCharacterArgsDto,
  ): Promise<Character[]> {
    return await this.characterService.all(args);
  }

  @Mutation(() => Character)
  async updateCharacter(
    @Param('id') id: string,
    @Args('dto') dto: CharacterDto,
  ) {
    return await this.characterService.update(id, dto);
  }

  @Mutation(() => Character)
  async addCharacter(@Args('dto') dto: CharacterDto) {
    return await this.characterService.add(dto);
  }

  @Mutation(() => Boolean)
  async removeCharacter(@Args('id') id: string) {
    await this.characterService.remove(id);
    return true;
  }
}
