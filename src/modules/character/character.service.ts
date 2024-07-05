import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Character } from '../../entity/character.entity';
import { Repository } from 'typeorm';
import { CharacterDto } from './dto/character.dto';
import { FetchCharacterArgsDto } from './dto/fetch-character.dto';
import { Episode } from '../../entity/episode.entity';

@Injectable()
export class CharacterService {
  public constructor(
    @InjectRepository(Character)
    private readonly characterRepository: Repository<Character>,
    @InjectRepository(Episode)
    private readonly episodeRepository: Repository<Episode>,
  ) {}

  public async add(input: CharacterDto) {
    const episodesArray = await this.saveEpisodes(input.episodes);
    const payload = {
      name: input.name,
      planet: input.planet,
      episodes: episodesArray,
    };

    return await this.characterRepository.save(payload);
  }

  private async saveEpisodes(episodes: string[]): Promise<Episode[]> {
    const episodesArray = [];
    for (const episode of episodes) {
      let episodeEntity = await this.findEpisodeByName(episode);
      if (!episodeEntity || !episodesArray.find((e) => e.name === episode)) {
        const newEpisode = this.episodeRepository.create({ name: episode });
        episodeEntity = await this.episodeRepository.save(newEpisode);
      }
      episodesArray.push(episodeEntity);
    }
    return episodesArray;
  }

  public async all(args: FetchCharacterArgsDto = { skip: 0, take: 5 }) {
    const result = await this.characterRepository.find({
      skip: args.skip,
      take: args.take,
      join: {
        alias: 'character',
        leftJoinAndSelect: {
          episodes: 'character.episodes',
        },
      },
    });

    return result.map((character) => {
      return {
        ...character,
        episodes: character.episodes.map((episode) => episode.name),
      };
    });
  }

  public async update(id: string, input: CharacterDto) {
    const character = await this.characterRepository.findOne({ where: { id } });

    if (!character) {
      throw new NotFoundException('Character not found');
    }

    const episodesArray = await this.saveEpisodes(input.episodes);
    character.episodes.push(...episodesArray);

    const { episodes, ...rest } = input;

    const updatedCharacter = await this.characterRepository.save({
      ...character,
      ...rest,
    });

    return updatedCharacter;
  }

  private async findEpisodeByName(name: string): Promise<Episode> {
    return await this.episodeRepository.findOne({ where: { name } });
  }

  public async remove(id: string): Promise<boolean> {
    const character = await this.characterRepository.findOne({ where: { id } });

    if (!character) {
      throw new NotFoundException('Character not found');
    }
    await this.characterRepository.delete(id);
    return true;
  }
}
