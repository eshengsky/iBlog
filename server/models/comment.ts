import { Schema, model, models, Model } from 'mongoose';
import { IComment } from '@/types/schema';

export const schema = new Schema<IComment>(
  {
    // 评论者昵称
    username: { type: String, required: true },

    // 昵称链接
    website: { type: String },

    // 评论内容
    content: { type: String },

    // 创建时间
    createTime: { type: Date, default: new Date() }
  },
  {
    // 设置查询时默认返回虚拟字段
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

export class Comment {
    private _model: Model<IComment>;

    constructor () {
      if (models.comment) {
        this._model = models.comment;
      } else {
        schema.add({
          post: { type: Schema.Types.ObjectId, ref: 'post' }
        });
        this._model = model<IComment>('comment', schema, 'comment');
      }
    }

    public get model (): Model<IComment> {
      return this._model;
    }
}
