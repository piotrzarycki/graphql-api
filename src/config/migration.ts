import { DataSource } from 'typeorm';
import { dbConfig } from './db';

export const connectionSource = new DataSource(dbConfig);
