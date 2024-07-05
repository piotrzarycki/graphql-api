import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { CharacterService } from './character.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Character } from '../../entity/character.entity';
import { Episode } from '../../entity/episode.entity';

describe('CharacterService (unit)', () => {
  let service: CharacterService;
  let characterRepository: Repository<Character>;
  let episodeRepository: Repository<Episode>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharacterService,
        {
          provide: getRepositoryToken(Character),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Episode),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();
    service = module.get<CharacterService>(CharacterService);
    characterRepository = module.get<Repository<Character>>(
      getRepositoryToken(Character),
    );
    episodeRepository = module.get<Repository<Episode>>(
      getRepositoryToken(Episode),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('all', async () => {
    const params = {
      skip: 10,
      take: 3,
      join: {
        alias: 'character',
        leftJoinAndSelect: {
          episodes: 'character.episodes',
        },
      },
    };
    characterRepository.find = jest.fn().mockResolvedValue([
      {
        name: 'test',
        description: 'test',
        episodes: [{ name: 'test' }],
      },
    ]);
    await service.all(params);
    expect(characterRepository.find).toHaveBeenCalledWith(params);
  });

  it('update', async () => {
    const characterDto = {
      name: 'test',
      description: 'test',
      episodes: ['123'],
    };
    characterRepository.findOne = jest.fn().mockResolvedValueOnce(characterDto);
    await service.update('123', characterDto);
    expect(characterRepository.save).toHaveBeenCalledWith(characterDto);
  });

  it('add', async () => {
    const characterDto = {
      name: 'test',
      episodes: ['123'],
      planet: 'test',
    };
    episodeRepository.save = jest.fn().mockResolvedValueOnce('123');
    await service.add(characterDto);
    expect(characterRepository.save).toHaveBeenCalledWith(characterDto);
  });

  it('remove', async () => {
    characterRepository.findOne = jest
      .fn()
      .mockResolvedValueOnce({ id: '123' });
    await service.remove('123');
    expect(characterRepository.delete).toHaveBeenCalledWith('123');
  });

  it('remove should throw NotFoundException', async () => {
    characterRepository.findOne = jest.fn().mockResolvedValueOnce(null);
    await expect(service.remove('123')).rejects.toThrow('Character not found');
  });
});
