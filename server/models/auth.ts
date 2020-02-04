import { Schema, model, models, Model } from 'mongoose';
import { IAuth } from '@/types/schema';

export class Auth {
    private _model: Model<IAuth>;

    constructor () {
      const schema = new Schema<IAuth>(
        {
          // 密码（已md5加密）
          password: { type: String },

          // 创建时间
          createTime: { type: Date, default: new Date() },

          // 修改时间
          modifyTime: { type: Date, default: new Date() }
        },
        {
          // 设置查询时默认返回虚拟字段
          toJSON: { virtuals: true },
          toObject: { virtuals: true }
        }
      );

      if (models.auth) {
        this._model = models.auth;
      } else {
        this._model = model<IAuth>('auth', schema, 'auth');
      }
    }

    public get model (): Model<IAuth> {
      return this._model;
    }
}
