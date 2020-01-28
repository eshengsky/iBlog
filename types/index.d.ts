export interface IBlogConfig {
    /**
     * 主机名
     */
    host: string;
    /**
     * 端口号
     */
    port: number;

    /**
     * 是否启用HTTPS
     */
    enableHTTPS: boolean;

    /**
   * MongoDB链接
   */
    mongoUrl: string;

    /**
   * JWT秘钥
   */
    jwtSecret: string;
}

export interface IResp {
    /** 响应 code */
    code: 1 | -1 | -2;

    /** 响应数据 */
    data?: any;

    /** 错误消息 */
    message?: string;
}

declare module 'vue/types/vue' {
    interface Vue {
        $bus: Vue;
    }
}
