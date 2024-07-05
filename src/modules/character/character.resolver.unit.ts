import { Test, TestingModule } from '@nestjs/testing';
import { CharacterResolver } from './character.resolver';
import { CharacterService } from './character.service';

const mockCharacterService = {
  all: jest.fn(),
  update: jest.fn(),
  add: jest.fn(),
  remove: jest.fn(),
};

describe('CharacterResolver (unit)', () => {
  let resolver: CharacterResolver;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharacterResolver,
        { provide: CharacterService, useValue: mockCharacterService },
        { provide: 'CharacterRepository', useFactory: jest.fn() },
        { provide: 'EpisodeRepository', useFactory: jest.fn() },
      ],
    }).compile();
    resolver = module.get<CharacterResolver>(CharacterResolver);
  });

  it('updateCharacter', () => {
    const characterDto = {
      name: 'test',
      description: 'test',
      episodes: ['123'],
    };

    resolver.updateCharacter('123', characterDto);
    expect(mockCharacterService.update).toHaveBeenCalledWith(
      '123',
      characterDto,
    );
  });

  it('addCharacter', () => {
    const characterDto = {
      name: 'test',
      description: 'test',
      episodes: ['123'],
    };
    resolver.addCharacter(characterDto);
    expect(mockCharacterService.add).toHaveBeenCalledWith(characterDto);
  });

  it('removeCharacter', () => {
    resolver.removeCharacter('123');
    expect(mockCharacterService.remove).toHaveBeenCalledWith('123');
  });

  it('characters', () => {
    const fetchCharacterArgsDto = {
      skip: 10,
      take: 3,
    };
    resolver.characters(fetchCharacterArgsDto);
    expect(mockCharacterService.all).toHaveBeenCalledWith(
      fetchCharacterArgsDto,
    );
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
