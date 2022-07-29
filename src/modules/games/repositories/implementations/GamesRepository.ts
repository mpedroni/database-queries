import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("game")
      .where("game.title ILIKE :title", { title: `%${param}%` })
      .select("title")
      .execute();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(`
      SELECT COUNT(*) FROM games
    `);
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return this.repository
      .createQueryBuilder("game")
      .innerJoin("game.users", "user")
      .where("game.id = :id", { id })
      .select("user.email, user.first_name, user.last_name")
      .execute();
  }
}
