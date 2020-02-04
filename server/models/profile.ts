import { Schema, model, models, Model } from 'mongoose';
import { IProfile } from '@/types/schema';

export class Profile {
    private _model: Model<IProfile>;

    constructor () {
      const schema = new Schema<IProfile>({
        enName: { type: String },
        cnName: { type: String },
        avatar: { type: String },
        introduction: { type: String },
        github: { type: String },
        email: { type: String },
        createTime: { type: Date },
        modifyTime: { type: Date }
      });

      if (models.profile) {
        this._model = models.profile;
      } else {
        this._model = model<IProfile>('profile', schema, 'profile');
      }
    }

    public get model (): Model<IProfile> {
      return this._model;
    }
}
