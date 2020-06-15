<template>
  <div class="profile-container">
    <div v-if="profile" class="profile-wrap">
      <div class="avatar-wrap" :style="{ backgroundImage: `url(${profile.avatar || defaultAvatar})` }" />
      <div class="main-wrap">
        <div class="header">
          <h3 v-if="profile.enName">
            {{ profile.enName }}
          </h3>
          <h4>{{ profile.cnName }}</h4>
        </div>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="body" v-html="profile.introduction" />
        <div v-if="profile.github || profile.email" class="footer">
          <a v-if="profile.github" :href="profile.github" title="GitHub" target="_blank"><font-awesome-icon :icon="['fab', 'github']" /> {{ profile.github }}</a>
          <span v-if="profile.email" title="Email"><font-awesome-icon :icon="['far', 'envelope']" /> {{ profile.email }}</span>
        </div>
      </div>
    </div>
    <div v-else class="empty-profile">
      <a-empty>
        <span slot="description">暂无内容</span>
      </a-empty>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import { IProfile, ISetting } from '@/types/schema';
import { Context } from '@nuxt/types/index';
import '@/static/article.less';
export default Vue.extend({
  name: 'PageProfile',
  async asyncData ({ $axios, error }: Context) {
    const { code, data } = await $axios.$get('/api/profile');
    if (code === 1) {
      const profile = data.profile;
      const md = new MarkdownIt({
        html: true,
        // breaks: true,
        // linkify: true,
        highlight (str, lang) {
          let showLang = '';
          let code = '';
          if (lang) {
            showLang = lang.toUpperCase();
            if (showLang === 'JS') {
              showLang = 'JAVASCRIPT';
            } else if (showLang === 'TS') {
              showLang = 'TYPESCRIPT';
            }
            const langObj = hljs.getLanguage(lang);
            if (langObj) {
              try {
                code = hljs.highlight(lang, str, true).value;
              } catch (err) {}
            }
          }
          if (!code) {
            code = md.utils.escapeHtml(str);
          }

          // 特殊：信息代码块
          if (showLang === 'INFO') {
            return `<pre class="hljs info"><code><svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="info-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-info-circle"><path fill="currentColor" d="M256 40c118.621 0 216 96.075 216 216 0 119.291-96.61 216-216 216-119.244 0-216-96.562-216-216 0-119.203 96.602-216 216-216m0-32C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm-36 344h12V232h-12c-6.627 0-12-5.373-12-12v-8c0-6.627 5.373-12 12-12h48c6.627 0 12 5.373 12 12v140h12c6.627 0 12 5.373 12 12v8c0 6.627-5.373 12-12 12h-72c-6.627 0-12-5.373-12-12v-8c0-6.627 5.373-12 12-12zm36-240c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32z" class=""></path></svg>${code}</code></pre>`;
          }

          // 特殊：警告代码块
          if (showLang === 'ALERT') {
            return `<pre class="hljs alert"><code><svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="exclamation-triangle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="svg-inline--fa fa-exclamation-triangle"><path fill="currentColor" d="M270.2 160h35.5c3.4 0 6.1 2.8 6 6.2l-7.5 196c-.1 3.2-2.8 5.8-6 5.8h-20.5c-3.2 0-5.9-2.5-6-5.8l-7.5-196c-.1-3.4 2.6-6.2 6-6.2zM288 388c-15.5 0-28 12.5-28 28s12.5 28 28 28 28-12.5 28-28-12.5-28-28-28zm281.5 52L329.6 24c-18.4-32-64.7-32-83.2 0L6.5 440c-18.4 31.9 4.6 72 41.6 72H528c36.8 0 60-40 41.5-72zM528 480H48c-12.3 0-20-13.3-13.9-24l240-416c6.1-10.6 21.6-10.7 27.7 0l240 416c6.2 10.6-1.5 24-13.8 24z" class=""></path></svg>${code}</code></pre>`;
          }

          // 特殊：以冒号开头的，视为特殊代码块
          if (showLang.startsWith(':')) {
            const header = showLang.substring(1);
            return `<pre class="hljs custom"><div class="pre-header">${header}</div><code>${code}</code></pre>`;
          }
          return (
            '<pre class="hljs"><div class="pre-header"><div class="pre-header-left"><div></div><div></div><div></div></div><div class="pre-header-right">' +
                    showLang +
                    '</div></div><code>' +
                    code +
                    '</code></pre>'
          );
        }
      });
      profile.introduction = md.render(profile.introduction).replace(
        /:([\w-]+?):/g,
        '<i class="icon-emoji" style="background-image: url(/images/emojis/$1.png);"></i>'
      );
      return {
        profile
      };
    } else {
      error({
        statusCode: 404,
        message: '未找到该页面'
      });
    };
  },
  data () {
    return {
      profile: {} as IProfile,
      defaultAvatar: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAPWUlEQVR4Xu2dC/RlYxnGn0e15K4wpiyrXFqJGeRWhlxGapRUU6JIroPcNYPkkqEYNW4pMrm3kMilRLMmJFHJrRmKLhS5FmKadOFtvWbL+M/8zzn7O3vvs/d+n2+t/zqzZn2393nf39ln7/1970eoSAEpMKwClDZSQAoMr4AAUXRIgQ4KCBCFhxQQIIoBKZCmgK4gabqpVRAFBEgQR8vMNAUESJpuahVEAQESxNEyM00BAZKmm1oFUUCABHG0zExTQICk6aZWQRQQIEEcLTPTFBAgabqpVRAFBEgQR8vMNAUESJpuahVEAQESxNEyM00BAZKmm1oFUUCABHG0zExTQICk6aZWQRQQIEEcLTPTFBAgabqpVRAFBEgQR8vMNAUESJpuahVEAQESxNEyM00BAZKmW65WZvYGAGsDGJX9vQ3AEgAWzf4WyT79/7w8B2AOgH9mn/5v/7/7AcwCMBPA3SSfyTURVc6tgADJLVn3BmY2BsAmADYHsBaA5bu3SqrxGIA7AdwI4Cckf5HUixoNq4AAKSA4zGxxAHsCeD+AjbKrQQE95+5iNoCbAVwLYBpJvwKp9KGAAOlDPDNbDsBBAPYGsHQfXZXR9G8ATgdwKsmnyxggQp8CJMHLZrYMgGMA7JPQvOomzwP4hs+X5LNVD9708QRIDg+ameu1G4ApAN6Yo2kdqvr9ykEkL6nDZJoyBwHSo6fMzJ88XQDg3T02qWu1GQB2JflQXSdYp3kJkB68YWYOxXUAluqhehOqPAFgC5L+yFilgwICpEt4mNk4AFcCWLhlkeTvVcaRvKVldhVqjgDpIKeZbQvg0kIVr19n7yX54/pNqx4zEiDD+MHMVgNwVwuvHEMt9rfxa5B8pB4hWa9ZCJAF+MPMFsvgWLVe7iptNrcB2JDkC6WN0NCOBciCAfFHods11Kep055KcmJq47a2EyBDPGtmGwKIeOP6IoDVSd7X1mBPsUuAzA/I7QDWSRGzBW2+R/JjLbCjMBMEyDxSmpkHx2WFqdvMjjYg6fckKgAEyKsB+Q0Af3oVuVxHcqvIAsxruwDJ1DCzTbN9FdFjwwCsTPLB6EK4/QLkFUAuBLCjguIlBSaTPFpaCJCXYsDMlgTg65PatpwkNcYfIblCauM2tdMVZC4gvhvwzDY5tgBbtARFP7HmhpGZXQ3gQwUEVZu6OInk59pkUIot4a8gZrYQAN9p58tLVF5RYBbJ0dEFESB6etWJgREkn4wMiQAxOw7AFyIHQQfbdyLpT/fCFgFiNh3AlmEjoLPhp5E8ILI2AsTsUQAjIwdBB9tvIDk2sjahATEz32Ou9J3DE/AUSU9xFLZEB8S/HbXdtHP4jyT5eFRCogOyH4DTojq/R7vHkryhx7qtqxYdkJOy1KGtc2yBBnkOrXML7K9RXUUHxPd+aINQ55A9muTkRkV1gZONDsgvAaxfoJ5t7Opskru30bBebIoOiN98juhFqMB1ppP0Yx1CluiA+OYglc4KzCS5ZlSRwgJiZssCCL3OqMegf5jkij3WbV21yIB4tnY/80+lswKzSb58dmI4rSIDsgEAnenXW8gvRDLkz9HIgPiNpx9poNJdgWVJ+pFu4UpkQD4B4DvhPJ5msGc5eSCtabNbRQZkZwBh3xDnDNtRJO/J2aYV1SMD4ifT+uGWKt0VWI+kp2QNVyIDcjCAqeE8nmbwxiR/lta02a0iA3I4gC81232VzT5sCqDIgBwL4IjKQqzZA21N8ppmm5A2+8iA+Fnnh6TJFq7VeJJXhLM6cuI4M/P7D78PUemuwLYkQx4LEfkKciqA/bvHhmoA2J5kyHdGkQE5HcA+Cv+eFNiB5EU91WxZpciAeLJqT1qt0l2BsAnkIgNyFoA9useGagDYmeT5EZWIDMgZAPaK6PQEmyeQnJbQrvFNIgPyNQD7Nt6D1RiwL8mvVzNUvUaJDMjJAA6slztqO5uDSJ5S29mVOLHIgHwFwMQStW1T14eSPLFNBvVqS2RAjgdwWK9CBa93BMmQ69YiA3Kkn+YaPPB7NV+A9KpUW+qZ2SQAIX82JPhwIsmQWwMiX0H8CZY/yVLprsDeJEOeAhwZkN0AfKt7bKgGAL1JjxYGZjYewOXR7E60dxzJHyW2bXSzyFcQ5cXqPXTXJDmz9+rtqRkZkBUAPNweV5ZqyTIknyp1hJp2HhYQ94eZhcwWmDMW55BcLGeb1lSPDoj/bBjVGm+WY8htJP3naMgSHRDfBPTJkJ7v3WgdoNO7Vu2qaWZK/dPdpQeQDHvQafQryJYApnePkdA1xpC8NaoC0QFZGMAcAAtFDYAudj8PYHGSL0TVJzQg2ZOsXwFYN2oAdLH7epJbRNZGgCg/Vqf4P4qkZ6AMWwSImX9DzggbAZ0NX5fkHZG1ESBmfv/xHIBFIwfCAmx/lOSbo2sSHpDsPuRSANtGD4Yh9p9B8rPRNREgc5ec6Di2+UkYS/IGARJdgbmAvB7AEwDCHnc8JAweIemLOcMXXUGyEDAzP6/Qzy1UAaaQVEKLyMcfDKXAzDYDEP4nRabLaiTv0zcFoCvIPFFgZvcCeEfwwJhO0s+QV9EV5NUxYGa7ADgneGSE3V67IL/rCjJEFTN7HMCIoJDMIjk6qO0LNFuAzA/IfgCiLu/+KMkrBcgrCgiQ+QF5LYD7AawULFDuIKlFm0OcLkAWQIGZ+S7DaEeOhd73MdyXoQAZRhkz+zmAdwW5ilxM8lNBbM1lpgAZHpC1ANwZ4EmfbxhbheRjuSInSGUB0sHRZhbhmLZJJL8aJN5zmylAOgOyZHbDvnxuZZvRwF+Mjib5YjOmW/0sBUgXzc3Ml8H7cvi2Fd9n7hui7m6bYUXaI0B6UNPMrgKwTQ9Vm1TlBJKfb9KEBzFXAdKD6ma2DIBZAEb2UL0JVfyqsR7J/zZhsoOcowDpUX0z2wjATS1IEeTbi/2+4089mh66mgDJ4X4zOxTACTma1LHqh0leXceJ1XFOAiSnV8zMV/v6qt8mlrDnnac6S4DkVM7mZkG5HsCmOZsOuvpZJPcc9CSaNr4ASfCYmfl5GdcB2Dih+SCaXEDyM4MYuOljCpBED5rZIlni67pDMo3khEQzwzcTIH2EgJl5srmLa/yO5FiSR/VhYvimAqTPEDAz1/DLAOqUBeTfAHYgeVmf5oVvLkAKCoFsScrZNcit9YBniSR5e0Gmhe5GgBTofjPzXLbfBTCmwG7zdDUNwIEkfQm7SgEKCJACRJy3i+wxsO9r959dVSXEfgbAp0n+oGBzwncnQEoKATNbGYDfA7yzpCFe7vY2AP52/NGSxwnZvQAp0e1m9kUAR5c4hHd9DEkfR6UEBQRICaK+3KUAKVHciroWICUKLUBKFLeirgVIiUILkBLFrahrAVKi0AKkRHEr6lqAlCi0AClR3Iq6FiAlCi1AShS3oq4FSIlCC5ASxa2oawFSotACpERxK+pagJQotAApUdyKuhYgiUKbmWddHAXAT4N9U5YSaOhnVRkZ/dAfX2ri+XWHfj7sKYtIejYTlZwKCJAugpnZ0hkIqwOY969pxyT/BcA9ADzdqP/5v+8h+fecMROqugAZ4m4zWxXAewBskn2u0vKI+F2W78tzft1E8sGW25vLvPCAmNkaADbPYPDP5XIp2L7K/nPNs7b81D+jHwcdDpBsH/kWAD4AYCsAb2lfjBdq0R8AXAvghxkw/yq095p3FgIQM/PzBj8CYByA99XcJ3We3vPZ1cWBuYrkQ3WebBFzay0gZuaJpncAsB2A9YsQS328SgEDcAuAS/x4CJJPtFGfVgFiZssC2D6DwpNNt8q+GgegH8BzY5YC6XKST9d4rrmm1vgAytLu+L2Ep9X8IIDX5FJAlYtWwFMOXQHgTJIOTaNLYwHJrhYOxe4A3tpoL7R38vcB+CaAc5r6vqVxgJiZJ0E4JPsp1d7Qap9l5wKY0rTHxo0BxMzenqXSGd++2AljkZ+L+G0AR5H8cxOsrj0g2SPayQD8oHs/ekCl+Qr8B8BZACbX/elXbQExsxH+TQNgn+bHgywYRgF/r3IagOPqupiydoCY2cIADgbgJ7AuodAKocCTAI4E4Ec11OrM9loBYmb+Um+Kln+EgGJBRvoK4/1J+lqwWpRaAJLdgPvZf4NK+lwLZ2gS/1fg+/5eqw7pVAcOiJntAeCUChM9Kw6boYC/jd+RpC+SHFgZGCDZjrzzs0WEAxNAA9degVMBTCLpT74qLwMBxMzWAXAlgBUrt1gDNlGBuwGMJ/nHqidfOSBm5u8zzgPwuqqN1XiNVsD31G9N0nc+VlYqBcTM/FGev/RTkQIpCvjPrJ1JXpTSOKVNJYBkpy758WC7pkxSbaTAEAUOJ3l8FaqUDki2xdWXP2snXxUejTOGL6ffu2xzSwUkeys+A8DGZRui/kMqcCHJncq0vDRAMjj8GfbYMg1Q3+EV8OUpE8pSoRRABEdZ7lK/wyhQGiRlAeJXDt8GqyIFqlJgKsmJRQ9WOCBm5ueD+0pcFSlQtQIfJ3l5kYMWCoiZeTK2a4qcoPqSAjkUmANgXZK/zdGmY9XCADGzlQH4koDFi5qc+pECCQr8HsDaJP+R0Ha+JkUC8msAo4uYlPqQAn0qcBFJTxrYdykEEDM7EMDJfc9GHUiB4hTYtIh1W30DYmZLAfAcrdoeW5xz1VP/CtxL0jP391WKAMSzU/imJxUpUDcF9iLpieuSS1+AmNlaAO5KHl0NpUC5CvwVwEokZ6cO0y8gviOw1LUwqYapnRTIFNiP5OmpaiQDYmZ+z+HpWjxNj4oUqKsCM0mumTq5fgA5IEu2kDq22kmBqhQYQ/LWlMH6AcQPf/QDL1WkQN0VOI/kLimTTALEzNYGcGfKgGojBQagwGySSa8hUgHx1KBTB2CohpQCqQok/cxKBeQqANukzlTtpMAAFDiMpKe1zVVyA5IdefasFiXm0lmVB6/AtSR9tXmukgKIPzLzVbsqUqBJCiTdh6QAoj0fTQoLzXVeBUaSfDyPJCmA+DHLF+cZRHWlQE0UWIdkrqevKYD4ybJn1sRgTUMK5FHAU5fm2vGaAsgkACfmmZXqSoGaKDCBpGf47LmkALIZAP9TkQJNU2AGyZvzTDo3IHk6V10p0HQFBEjTPaj5l6qAAClVXnXedAUESNM9qPmXqoAAKVVedd50BQRI0z2o+ZeqgAApVV513nQFBEjTPaj5l6qAAClVXnXedAUESNM9qPmXqoAAKVVedd50BQRI0z2o+ZeqwP8At8qL9pTBFl0AAAAASUVORK5CYII='
    };
  },
  head (this: any) {
    const settings = this.$store.state.settings as ISetting;
    const suffix = ` - ${settings.blogName}`;
    return {
      title: '关于' + suffix,
      meta: [
        { hid: 'description', name: 'description', content: settings.blogIntro || settings.blogName },
        { name: 'keywords', content: settings.blogName }
      ]
    };
  }
});
</script>
<style scoped>
.profile-container {
  min-height: 90vh;
}

.profile-wrap {
  background-image: linear-gradient(-90deg,#00BCD4 0,#1890ff 100%);
  border-radius: 10px;
  max-width: 680px;
  margin: 0 auto;
  position: relative;
  padding: 30px;
  top: 100px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.avatar-wrap {
    width: 120px;
    height: 120px;
    background-size: contain;
    background-color: #ccc;
    border-radius: 50%;
    border: 3px solid #fff;
    position: absolute;
    top: -60px;
    left: 50%;
    margin-left: -60px;
}

.main-wrap {
  color: #fff;
  padding-top: 55px;
}

.main-wrap .header {
  text-align: center;
}

.main-wrap .header h3 {
  font-size: 36px;
  color: #fff;
  font-weight: 300;
  margin-bottom: 5px;
}

.main-wrap .header h4 {
  font-size: 32px;
  color: #fff;
  font-weight: 400;
}

.main-wrap .body {
  font-size: 16px;
  margin-top: 40px;
  white-space: pre-line;
}

.main-wrap .footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  font-size: 15px;
}

.main-wrap .footer a {
  color: #fff;
  display: block;
}

.empty-profile {
  padding-top: 150px;
}

@media (max-width: 576px) {
  .profile-wrap {
    border-radius: 0;
  }

  .main-wrap .footer {
    display: block;
  }
}
</style>
