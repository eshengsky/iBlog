const emojis = [
  'grinning-face',
  'grinning-face-with-big-eyes',
  'beaming-face-with-smiling-eyes',
  'grinning-squinting-face',
  'face-with-tears-of-joy',
  'rolling-on-the-floor-laughing',
  'smiling-face',
  'smiling-face-with-smiling-eyes',
  'smiling-face-with-halo',
  'slightly-smiling-face',
  'upside-down-face',
  'winking-face',
  'relieved-face',
  'smiling-face-with-heart-eyes',
  'smiling-face-with-hearts',
  'face-blowing-a-kiss',
  'kissing-face-with-closed-eyes',
  'face-savoring-food',
  'squinting-face-with-tongue',
  'zany-face',
  'face-with-raised-eyebrow',
  'face-with-monocle',
  'nerd-face',
  'smiling-face-with-sunglasses',
  'star-struck',
  'partying-face',
  'smirking-face',
  'unamused-face',
  'pensive-face',
  'worried-face',
  'confused-face',
  'slightly-frowning-face',
  'persevering-face',
  'tired-face',
  'weary-face',
  'pleading-face',
  'crying-face',
  'loudly-crying-face',
  'face-with-steam-from-nose',
  'angry-face',
  'face-with-symbols-on-mouth',
  'exploding-head',
  'hot-face',
  'cold-face',
  'face-screaming-in-fear',
  'fearful-face',
  'sad-but-relieved-face',
  'downcast-face-with-sweat',
  'hugging-face',
  'thinking-face',
  'face-with-hand-over-mouth',
  'yawning-face',
  'shushing-face',
  'lying-face',
  'expressionless-face',
  'grimacing-face',
  'face-with-rolling-eyes',
  'hushed-face',
  'anguished-face',
  'flushed-face',
  'sleeping-face',
  'drooling-face',
  'dizzy-face',
  'zipper-mouth-face',
  'woozy-face',
  'nauseated-face',
  'face-vomiting',
  'sneezing-face',
  'face-with-medical-mask',
  'face-with-thermometer',
  'face-with-head-bandage',
  'money-mouth-face',
  'cowboy-hat-face',
  'smiling-face-with-horns',
  'angry-face-with-horns',
  'clown-face',
  'pile-of-poo',
  'ghost',
  'skull-and-crossbones',
  'alien',
  'robot',
  'jack-o-lantern',
  'cat-face',
  'grinning-cat',
  'smiling-cat-with-heart-eyes',
  'cat-with-tears-of-joy',
  'crying-cat',
  'raising-hands',
  'clapping-hands',
  'thumbs-up',
  'thumbs-down',
  'crossed-fingers',
  'victory-hand',
  'love-you-gesture',
  'ok-hand',
  'backhand-index-pointing-right',
  'raised-back-of-hand',
  'flexed-biceps',
  'folded-hands',
  'bone',
  'footprints',
  'eyes',
  'baby',
  'crown',
  'sunglasses',
  'dog-face',
  'mouse-face',
  'rabbit-face',
  'panda',
  'cow-face',
  'pig-face',
  'frog',
  'monkey-face',
  'unicorn',
  'fish',
  'spouting-whale',
  'sloth',
  'christmas-tree',
  'deciduous-tree',
  'tulip',
  'rose',
  'hibiscus',
  'cherry-blossom',
  'crescent-moon',
  'collision',
  'fire',
  'rainbow',
  'sun',
  'cloud',
  'snowman-without-snow',
  'sweat-droplets',
  'red-apple',
  'tangerine',
  'lemon',
  'banana',
  'watermelon',
  'strawberry',
  'cherries',
  'peach',
  'pineapple',
  'coconut',
  'eggplant',
  'avocado',
  'hot-pepper',
  'pancakes',
  'bacon',
  'cut-of-meat',
  'poultry-leg',
  'hot-dog',
  'hamburger',
  'pizza',
  'sandwich',
  'taco',
  'sushi',
  'shaved-ice',
  'ice-cream',
  'soft-ice-cream',
  'pie',
  'cupcake',
  'birthday-cake',
  'lollipop',
  'doughnut',
  'cookie',
  'baby-bottle',
  'hot-beverage',
  'cup-with-straw',
  'beer-mug',
  'wine-glass',
  'tumbler-glass',
  'tropical-drink',
  'bottle-with-popping-cork',
  'soccer-ball',
  'basketball',
  'american-football',
  'baseball',
  'pool-8-ball',
  'automobile',
  'bicycle',
  'airplane',
  'house',
  'mobile-phone',
  'laptop-computer',
  'desktop-computer',
  'camera',
  'television',
  'alarm-clock',
  'light-bulb',
  'money-with-wings',
  'money-bag',
  'gem-stone',
  'magnet',
  'bomb',
  'key',
  'teddy-bear',
  'wrapped-gift',
  'balloon',
  'party-popper',
  'blue-book',
  'pencil',
  'red-heart'
];
export default function editorEmojiPlugin (editor, options = {}) {
  editor.eventManager.listen('convertorAfterMarkdownToHtmlConverted', html => {
    return html.replace(
      /:([\w-]+?):/g,
      (_str, code) => {
        const title = code.replace(/-/g, ' ');
        return `<i title="${title}" class="icon-emoji" style="background-image: url(/images/emojis/${code}.png);"></i>`;
      }
    );
  });

  if (!editor.isViewer()) {
    const toolbar = editor.getUI().getToolbar();
    editor.eventManager.addEventType('emojiButtonClicked');

    const button = document.createElement('button');
    button.className = 'custom-button';
    button.innerHTML = '<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="smile" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" class="svg-inline--fa fa-smile"><path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm4 72.6c-20.8 25-51.5 39.4-84 39.4s-63.2-14.3-84-39.4c-8.5-10.2-23.7-11.5-33.8-3.1-10.2 8.5-11.5 23.6-3.1 33.8 30 36 74.1 56.6 120.9 56.6s90.9-20.6 120.9-56.6c8.5-10.2 7.1-25.3-3.1-33.8-10.1-8.4-25.3-7.1-33.8 3.1z" class=""></path></svg>';

    const { index = 100 } = options;
    toolbar.insertItem(index, {
      type: 'button',
      options: {
        name: 'emoji',
        className: 'emoji',
        event: 'emojiButtonClicked',
        tooltip: '插入表情',
        el: button
      }
    });

    const arr = emojis.map(emoji => {
      const title = emoji.replace(/-/g, ' ');
      return `
        <li>
          <i title="${title}" class="icon-emoji" data-code="${emoji}" style="background-image: url('/images/emojis/${emoji}.png');"></i>
        </li>
      `;
    });

    const wrap = document.createElement('div');
    wrap.className = 'popup-emojis';
    wrap.addEventListener('click', event => {
      const target = event.target;
      if (target.className === 'icon-emoji') {
        editor.insertText(`:${target.dataset.code}:`);
      }
    });
    wrap.innerHTML = `<ul>${arr.join('')}</ul>`;

    // const btnIndex = toolbar.indexOfItem('emoji');
    // const { el } = toolbar.getItem(btnIndex);

    const popup = editor.getUI().createPopup({
      header: false,
      title: null,
      content: wrap,
      className: 'tui-editor-popup',
      target: editor.getUI().getToolbar().el
    });

    editor.eventManager.listen('focus', () => {
      popup.hide();
    });

    editor.eventManager.listen('emojiButtonClicked', () => {
      if (popup.isShow()) {
        popup.hide();

        return;
      }

      editor.eventManager.emit('closeAllPopup');
      popup.show();
    });

    editor.eventManager.listen('closeAllPopup', () => {
      popup.hide();
    });

    editor.eventManager.listen('removeEditor', () => {
      popup.remove();
    });
  }
}
