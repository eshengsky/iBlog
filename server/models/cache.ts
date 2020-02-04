import { Schema, model, models, Model } from 'mongoose';
import { ICache } from '@/types/schema';

export class Cache {
    private _model: Model<ICache>;

    constructor () {
      const schema = new Schema<ICache>({
        clientIP: { type: String },
        ext1: { type: Schema.Types.Mixed },
        ext2: { type: Schema.Types.Mixed },
        ext3: { type: Schema.Types.Mixed },
        createTime: { type: Date, default: new Date(), expires: 3600 }
      });

      // 只有当model不存在时才创建model，主要是为了兼容开发模式下的HotReload
      if (models.cache) {
        this._model = models.cache;
      } else {
        this._model = model<ICache>('cache', schema, 'cache');
      }
    }

    public get model (): Model<ICache> {
      return this._model;
    }
}
