import { Module } from '@nestjs/common';
import { CharacterResolver } from './character.resolver';
import { CharacterService } from './character.service';
import { Character } from '../../entity/character.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episode } from '../../entity/episode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Character, Episode])],
  providers: [CharacterResolver, CharacterService],
})
export class CharacterModule {}
