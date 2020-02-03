import { Document } from 'mongoose';

export interface IAuth extends Document {
    _id: string;

    /**
     * 密码
     */
    password: string;

    /**
     * 创建时间
     */
    createTime: Date;

    /**
     * 修改时间
     */
    modifyTime: Date;
}

export interface ICategory extends Document {
    _id: string;

    /**
     * 分类名称
     */
    cateName: string;

    /**
     * 分类Alias
     */
    alias: string;

    /**
     * 分类图片
     */
    img: string;

    /**
     * 排序值
     */
    sequence: number;

    /**
     * 创建时间
     */
    createTime: Date;

    /**
     * 修改时间
     */
    modifyTime: Date;
}

export interface IPost extends Document {
    _id: string;

    /**
   * 标题
   */
    title: string;

    /**
   * 文章别名
   */
    alias: string;

    /**
   * 内容
   */
    content: string;

    /**
     * 编译为HTML后的内容
     */
    html: string;

    /**
   * 分类
   */
    category: ICategory;

    /**
   * 标签
   */
    labels: Array<string>;

    /**
   * 外链Url
   */
    url: string;

    /**
   * 浏览次数
   */
    viewCount: number;

    /**
   * 是否本地文档，否则是外链
   */
    isLocal: boolean;

    /**
   * 是否草稿
   */
    isDraft: boolean;

    /**
   * 是否有效
   */
    isActive: boolean;

    /**
     * 是否允许评论的标识
     */
    commentsFlag: number;

    /**
   * 创建时间
   */
    createTime: Date;

    /**
   * 修改时间
   */
    modifyTime: Date;

    /**
     *发布时间
     */
    publishTime?: Date;
}

export interface IComment extends Document {
    /**
     * 评论所在的文章
     */
    post: IPost;

    /**
     * 评论人昵称
     */
    username: string;

    /**
     * 评论人链接
     */
    website?: string;

    /**
     * 评论内容
     */
    content: string;

    /**
     * 创建时间
     */
    createTime: Date;
}

export interface ICache extends Document {
    _id: string;

    /**
   * 客户端IP地址
   */
    clientIP: string;

    /**
   * 扩展字段1
   */
    ext1: any,

    /**
   * 扩展字段2
   */
    ext2: any,

    /**
   * 扩展字段3
   */
    ext3: any,

    /**
   * 创建时间
   */
    createTime: Date;
}

export interface ISetting extends Document {
    _id: string;

    /**
   * 博客名称
   */
    blogName: string,

    /**
   * 博客标语
   */
    blogSlogan: string,

    /**
   * 博客logo，显示于网站左上角
   */
    blogLogo: string,

    /**
     * 备案信息
     */
    recordInfo: string,

    /**
   * 是否显示博客简介
   */
    showBlogIntro: boolean,

    /**
   * 博客简介内容
   */
    blogIntro: string,

    /**
   * 首页的每页展示文章条数
   */
    postPageSize: number,

    /**
   * 是否开启预览功能
   */
    enablePreview: boolean,

    /**
   * 是否显示文章底部版权信息
   */
    showLicense: boolean,

    /**
     * 是否允许文章评论
     */
    enableComments: boolean,

    /**
   * 评论及留言每页条数
   */
    commentPageSize: 20,

    /**
   * 是否开启百度统计功能
   */
    enableStatistics: boolean,

    /**
   * 百度统计Key
   */
    statisticsKey: string
}

export interface IProfile extends Document {
    _id: string;

    /**
     * 英文名
     */
    enName: string;

    /**
     * 中文名
     */
    cnName: string;

    /**
     * 头像
     */
    avatar: string;

    /**
     * 自我介绍
     */
    introduction: string;

    /**
     * GitHub地址
     */
    github: string;

    /**
     * Email地址
     */
    email: string;

    /**
     * 创建时间
     */
    createTime: Date;

    /**
     * 修改时间
     */
    modifyTime: Date;
}
