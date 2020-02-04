import { model, models, Model } from 'mongoose';
import { IComment } from '@/types/schema';
import { schema } from './comment';

export class Guestbook {
    private _model: Model<IComment>;

    constructor () {
      if (models.guestbook) {
        this._model = models.guestbook;
      } else {
        this._model = model<IComment>('guestbook', schema, 'guestbook');
      }
    }

    public get model (): Model<IComment> {
      return this._model;
    }
}
