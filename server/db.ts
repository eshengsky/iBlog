import { connect, connection, Connection, Model } from 'mongoose';
import { IPost, ICategory, IComment, ICache, ISetting, IProfile, IAuth } from '@/types/schema';
import config from '../blog.config';
import { Post } from './models/post';
import { Cache } from './models/cache';
import { Category } from './models/category';
import { Comment } from './models/comment';
import { Guestbook } from './models/guestbook';
import { Setting } from './models/setting';
import { Profile } from './models/profile';
import { Auth } from './models/auth';

interface IModels {
    Post: Model<IPost>;
    Cache: Model<ICache>;
    Category: Model<ICategory>,
    Comment: Model<IComment>,
    Guestbook: Model<IComment>,
    Setting: Model<ISetting>,
    Profile: Model<IProfile>,
    Auth: Model<IAuth>
}

export default class DB {
    private static instance: DB;

    private _db: Connection;
    private _models: IModels;

    private constructor () {
    // 连接 MongoDB
      connect(
        config.mongoUrl,
        {
          useUnifiedTopology: true,
          useNewUrlParser: true,
          useCreateIndex: true,
          useFindAndModify: false
        },
        () => {
          // 设置默认数据
          (this._models.Category as any).initData();
          (this._models.Setting as any).initData();
        }
      );
      this._db = connection;
      this._db.once('open', this.connected);
      this._db.on('error', this.error);

      this._models = {
        Post: new Post().model,
        Cache: new Cache().model,
        Category: new Category().model,
        Comment: new Comment().model,
        Guestbook: new Guestbook().model,
        Setting: new Setting().model,
        Profile: new Profile().model,
        Auth: new Auth().model
      };
    }

    public static get Models () {
      if (!DB.instance) {
        DB.instance = new DB();
      }
      return DB.instance._models;
    }

    private connected () {
      console.log('Mongoose has connected');
    }

    private error (error) {
      console.error('Mongoose has errored', error);
    }
}
